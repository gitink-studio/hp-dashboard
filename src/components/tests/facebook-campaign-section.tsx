import React from "react";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import { ROOT_URL } from "../../common/constants";

type Creative = {
    id: string;
    type: number;
    creativeName: string;         // user-entered label — always shown in the table
    creativeUrl: string;          // S3 video URL (empty when no video)
    creativeDisplayId: string;    // resolved display label from backend
    videoUrl: string | null;      // full https S3 URL, or null when no video
    status: "Active" | "Paused" | "Ended";
    impressions: number;
    clicks: number;
    installs: number;
    spend: number;
    cpi: number | null;
};

type FormState = {
    creativeName: string;   // manual creative name/ID (stored in creativeUrl when no video)
    status: string;
    impressions: string;
    clicks: string;
    installs: string;
    spend: string;
};

const EMPTY_FORM: FormState = {
    creativeName: "",
    status: "Active",
    impressions: "",
    clicks: "",
    installs: "",
    spend: "",
};

const statusColor = (s: string) =>
    s === "Active" ? "success" : s === "Paused" ? "warning" : "default";

const fmt = (n: number) => n.toLocaleString();
const fmtCpi = (n: number | null) => (n != null ? `$${n.toFixed(2)}` : "—");

type Props = {
    testId: string;
    readonly?: boolean; // publisher view can't add/edit
};

export const FacebookCampaignSection: React.FC<Props> = ({ testId, readonly = false }) => {
    const [creatives, setCreatives] = React.useState<Creative[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [editTarget, setEditTarget] = React.useState<Creative | null>(null);
    const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
    const [videoFile, setVideoFile] = React.useState<File | null>(null);
    const [submitting, setSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState("");
    // Upload progress state (only used when a video file is attached)
    type UploadPhase = "idle" | "s3" | "done";
    const [uploadPhase, setUploadPhase] = React.useState<UploadPhase>("idle");
    const [uploadPct, setUploadPct] = React.useState(0);
    const [uploadLabel, setUploadLabel] = React.useState("");
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const fetchCreatives = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${ROOT_URL}/tests/${testId}/facebook-creatives`);
            if (res.ok) setCreatives(await res.json());
        } finally {
            setLoading(false);
        }
    }, [testId]);

    React.useEffect(() => { fetchCreatives(); }, [fetchCreatives]);

    const openAdd = () => {
        setEditTarget(null);
        setForm(EMPTY_FORM);
        setVideoFile(null);
        setSubmitError("");
        setDialogOpen(true);
    };

    const openEdit = (c: Creative) => {
        setEditTarget(c);
        setForm({
            creativeName: c.creativeName || "",
            status: c.status,
            impressions: String(c.impressions),
            clicks: String(c.clicks),
            installs: String(c.installs),
            spend: String(c.spend),
        });
        setVideoFile(null);
        setSubmitError("");
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
        setEditTarget(null);
        setForm(EMPTY_FORM);
        setVideoFile(null);
        setSubmitError("");
        setUploadPhase("idle");
        setUploadPct(0);
        setUploadLabel("");
    };

    const handleField = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(f => ({ ...f, [field]: e.target.value }));

    const handleStatusChange = (e: SelectChangeEvent) =>
        setForm(f => ({ ...f, status: e.target.value }));

    /** Simple XHR wrapper — used only for the non-video (JSON) path */
    const jsonFetch = async (url: string, method: string, body: object) => {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error((await res.json()).error || `${method} failed`);
    };

    /**
     * Video upload with browser-native XHR progress tracking.
     * Uses xhr.upload.onprogress — no SSE or persistent connections required,
     * so it works reliably on AWS App Runner and behind any proxy/load balancer.
     */
    const uploadWithProgress = (
        url: string,
        method: string,
        metaPayload: object,
    ): Promise<void> =>
        new Promise((resolve, reject) => {
            const fd = new FormData();
            fd.append("creative-video", videoFile!);
            fd.append("metadata", JSON.stringify(metaPayload));

            const xhr = new XMLHttpRequest();

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const pct = Math.round((e.loaded / e.total) * 100);
                    setUploadPct(pct);
                    const loadedMB = (e.loaded / 1_048_576).toFixed(1);
                    const totalMB  = (e.total  / 1_048_576).toFixed(1);
                    setUploadLabel(`${loadedMB} / ${totalMB} MB`);
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    setUploadPhase("done");
                    resolve();
                } else {
                    try { reject(new Error(JSON.parse(xhr.responseText)?.error || `Upload failed (${xhr.status})`)); }
                    catch { reject(new Error(`Upload failed (${xhr.status})`)); }
                }
            };
            xhr.onerror   = () => reject(new Error("Network error during upload"));
            xhr.ontimeout = () => reject(new Error("Upload timed out"));
            xhr.timeout   = 15 * 60 * 1000; // 15 min

            xhr.open(method, url);
            xhr.send(fd);

            setUploadPhase("s3");
        });

    const handleSubmit = async () => {
        setSubmitting(true);
        setSubmitError("");
        setUploadPhase("idle");
        setUploadPct(0);
        setUploadLabel("");

        const url    = editTarget
            ? `${ROOT_URL}/tests/${testId}/facebook-creatives/${editTarget.id}`
            : `${ROOT_URL}/tests/${testId}/facebook-creatives`;
        const method = editTarget ? "PUT" : "POST";
        const metaPayload = {
            creativeName: form.creativeName || "",
            status: form.status,
            impressions: Number(form.impressions) || 0,
            clicks: Number(form.clicks) || 0,
            installs: Number(form.installs) || 0,
            spend: Number(form.spend) || 0,
        };

        try {
            if (videoFile) {
                await uploadWithProgress(url, method, metaPayload);
            } else {
                await jsonFetch(url, method, metaPayload);
            }

            await fetchCreatives();
            handleClose();
        } catch (err: any) {
            setSubmitError(err.message || "Something went wrong");
            setUploadPhase("idle");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (c: Creative) => {
        if (!window.confirm(`Delete creative "${c.creativeDisplayId}"?`)) return;
        try {
            await fetch(`${ROOT_URL}/tests/${testId}/facebook-creatives/${c.id}`, { method: "DELETE" });
            await fetchCreatives();
        } catch {/* silent */ }
    };

    const computedCpi = () => {
        const inst = Number(form.installs);
        const sp = Number(form.spend);
        return inst > 0 ? `$${(sp / inst).toFixed(2)}` : "—";
    };

    return (
        <Box>
            {!readonly && (
                <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={openAdd}
                    >
                        Add Creative
                    </Button>
                </Stack>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" py={3}>
                    <CircularProgress size={24} />
                </Box>
            ) : creatives.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                    No creatives added yet.{!readonly && " Click 'Add Creative' to upload a Facebook ad video."}
                </Typography>
            ) : (
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Creative Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Impressions</TableCell>
                            <TableCell align="right">Clicks</TableCell>
                            <TableCell align="right">Installs</TableCell>
                            <TableCell align="right">CPI</TableCell>
                            {!readonly && <TableCell align="center">Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {creatives.map((c) => (
                            <TableRow key={c.id} hover>
                                <TableCell>{c.type}</TableCell>
                                <TableCell>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        {c.videoUrl ? (
                                            // Clickable link that opens the S3 video in a new tab
                                            <Tooltip title="Open video in S3">
                                                <Typography
                                                    component="a"
                                                    href={c.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    variant="body2"
                                                    sx={{
                                                        fontFamily: "monospace",
                                                        fontSize: "0.75rem",
                                                        color: "primary.main",
                                                        textDecoration: "underline",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {c.creativeDisplayId}
                                                </Typography>
                                                
                                            </Tooltip>
                                        ) : (
                                            // Manual name — no video link
                                            <Typography
                                                variant="body2"
                                                sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
                                            >
                                                {c.creativeDisplayId}
                                            </Typography>
                                        )}
                                        {c.videoUrl && (
                                            <Tooltip title="Open video">
                                                <IconButton size="small" onClick={() => window.open(c.videoUrl!, "_blank")} sx={{ p: 0.25 }}>
                                                    <VideoFileIcon sx={{ fontSize: 14, color: "primary.main" }} />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={c.status}
                                        color={statusColor(c.status) as any}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">{fmt(c.impressions)}</TableCell>
                                <TableCell align="right">{fmt(c.clicks)}</TableCell>
                                <TableCell align="right">{fmt(c.installs)}</TableCell>
                                <TableCell align="right">{fmtCpi(c.cpi)}</TableCell>
                                {!readonly && (
                                    <TableCell align="center">
                                        <IconButton size="small" onClick={() => openEdit(c)}>
                                            <EditIcon fontSize="inherit" />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(c)}>
                                            <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Add / Edit dialog */}
            <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editTarget ? "Edit Creative Metrics" : "Add Facebook Creative"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {/* Creative ID — manual text entry */}
                        <TextField
                            label="Creative ID / Name"
                            size="small"
                            fullWidth
                            placeholder="e.g. PICK_v1_1080x1350_004037"
                            value={form.creativeName}
                            onChange={handleField("creativeName")}
                            helperText="Enter the Facebook ad creative name or ID. Shown in the table as the Creative ID."
                        />

                        {/* Video upload — optional, for any new or edited creative */}
                        <Box>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/*"
                                style={{ display: "none" }}
                                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                            />
                            <Button
                                variant="outlined"
                                startIcon={<VideoFileIcon />}
                                onClick={() => fileInputRef.current?.click()}
                                fullWidth
                                size="small"
                            >
                                {videoFile ? videoFile.name : "Attach S3 Video (optional)"}
                            </Button>
                            <Typography variant="caption" color="text.secondary">
                                Uploading a video links it to this creative. Not required if no video exists yet.
                            </Typography>
                        </Box>

                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select label="Status" value={form.status} onChange={handleStatusChange}>
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Paused">Paused</MenuItem>
                                <MenuItem value="Ended">Ended</MenuItem>
                            </Select>
                        </FormControl>

                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Impressions"
                                size="small"
                                type="number"
                                fullWidth
                                value={form.impressions}
                                onChange={handleField("impressions")}
                            />
                            <TextField
                                label="Clicks"
                                size="small"
                                type="number"
                                fullWidth
                                value={form.clicks}
                                onChange={handleField("clicks")}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Installs"
                                size="small"
                                type="number"
                                fullWidth
                                value={form.installs}
                                onChange={handleField("installs")}
                            />
                            <TextField
                                label="Spend ($)"
                                size="small"
                                type="number"
                                fullWidth
                                value={form.spend}
                                onChange={handleField("spend")}
                            />
                        </Stack>

                        <Box sx={{ bgcolor: "action.hover", borderRadius: 1, p: 1.5 }}>
                            <Typography variant="body2" color="text.secondary">
                                Calculated CPI: <strong>{computedCpi()}</strong>
                                &nbsp;&nbsp;(Spend ÷ Installs — saved automatically)
                            </Typography>
                        </Box>

                        {/* Upload progress — shown only when a video is being uploaded */}
                        {submitting && videoFile && uploadPhase !== "idle" && (
                            <Box sx={{ bgcolor: "action.hover", borderRadius: 1, p: 1.5 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
                                    <Typography variant="caption" fontWeight="bold" color="text.primary">
                                        {uploadPhase === "s3"   && "Uploading to S3…"}
                                        {uploadPhase === "done" && "✓ Upload complete"}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {uploadPhase === "s3" && `${uploadPct}%`}
                                    </Typography>
                                </Stack>

                                <LinearProgress
                                    variant={uploadPhase === "s3" ? "determinate" : "indeterminate"}
                                    value={uploadPhase === "s3" ? uploadPct : 100}
                                    color={uploadPhase === "done" ? "success" : "primary"}
                                    sx={{ borderRadius: 1, height: 8 }}
                                />

                                {uploadPhase === "s3" && uploadLabel && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                                        {uploadLabel}
                                    </Typography>
                                )}
                            </Box>
                        )}

                        {submitError && (
                            <Typography variant="body2" color="error">{submitError}</Typography>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting
                            ? uploadPhase === "s3"
                                ? `Uploading… ${uploadPct}%`
                                : <CircularProgress size={18} />
                            : editTarget ? "Save" : "Add Creative"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FacebookCampaignSection;
