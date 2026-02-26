# 🎯 Admin Configuration Usage Guide

## ✅ How to Access Advanced Report Configuration

Your advanced configuration system is now fully operational. Here's how to use it:

---

## 📍 Accessing the Configuration Pages

### Method 1: Direct URL

```
http://localhost:5173/#/advanced-report-configuration
```

Or with SDK pre-selected:
```
http://localhost:5173/#/advanced-report-configuration?sdk=hyper_rabbit&platform=Android
http://localhost:5173/#/advanced-report-configuration?sdk=game_analytics&platform=iOS
```

### Method 2: Via Menu

1. Start the dashboard: `npm run dev` or `npm start`
2. Login as admin user
3. Look in the sidebar menu for:
   - **Advanced Config** → Opens advanced configuration
   - **Report Configuration** → Opens standard configuration
   - **SDK Configuration** → Opens SDK info viewer
   - **GA Import/Export** → Opens import/export manager

### Method 3: From Report Configuration Page

1. Navigate to: `http://localhost:5173/#/report-configuration`
2. Click the **"SDK Types"** tab
3. Click **"Configure Events & Metrics"** button for any SDK
4. Advanced configuration opens with that SDK pre-selected

---

## 🎨 Admin Pages Available

### 1. **Advanced Report Configuration** ⭐ (Main Configuration)

**URL:** `/#/advanced-report-configuration`

**Menu:** "Advanced Config"

**Features:**
- ✅ Select SDK Type (Hyper Rabbit / Game Analytics)
- ✅ Select Platform (Android / iOS)
- ✅ Edit Event-Metric Mappings
- ✅ Enable/Disable Events
- ✅ Associate Metrics with Events
- ✅ Configure SDK Settings
- ✅ Export/Import Configuration

**Use For:** Detailed event and metric configuration

---

### 2. **Report Configuration** (Standard Configuration)

**URL:** `/#/report-configuration`

**Menu:** "Report Configuration"

**Features:**
- ✅ Platform rules
- ✅ Report definitions
- ✅ SDK types overview
- ✅ Configuration preview

**Use For:** High-level report management

---

### 3. **SDK Configuration** (Information View)

**URL:** `/#/sdk-configuration`

**Menu:** "SDK Configuration"

**Features:**
- ✅ View all events
- ✅ View all metrics
- ✅ View report templates
- ✅ Filter by SDK and platform

**Use For:** Viewing SDK information and documentation

---

### 4. **Game Analytics Import/Export** (Data Management)

**URL:** `/#/game-analytics-import`

**Menu:** "GA Import/Export"

**Features:**
- ✅ Import events from Excel/CSV
- ✅ Export events to Excel/CSV
- ✅ Export metrics to Excel
- ✅ Download import template
- ✅ View import statistics
- ✅ Delete events for re-import

**Use For:** Importing/exporting event data

---

## 🔧 Step-by-Step: Configure Event-Metric Mappings

### Step 1: Access Advanced Configuration

```
Navigate to: http://localhost:5173/#/advanced-report-configuration
```

Or click "Advanced Config" in the sidebar menu.

### Step 2: Select SDK and Platform

At the top of the page:
1. **SDK Type:** Select "Hyper Rabbit" or "Game Analytics"
2. **Platform:** Select "Android" or "iOS"

The page updates automatically to show events and metrics for your selection.

### Step 3: View Event-Metric Mappings

Click the **"Event-Metric Mapping"** tab (should be selected by default).

You'll see a table showing:
- ☑️ Checkbox - Enable/disable event
- Event Name - The event type
- Category - Event category (gameplay, monetization, etc.)
- Associated Metrics - Which metrics are calculated from this event
- Status - Enabled/Disabled
- Actions - Edit button

### Step 4: Edit an Event Mapping

1. Find the event you want to configure (e.g., `session_start`)
2. Click the **Edit** button (✏️)
3. A dialog opens showing all available metrics
4. **Check** metrics you want to calculate from this event
5. **Uncheck** metrics you don't want
6. Click **"Save Mapping"**

**Example:**
```
Event: session_start
Available Metrics:
☑️ DAU (Daily Active Users)
☑️ MAU (Monthly Active Users)
☑️ Number of Sessions
☐ Session Length (uncheck if not needed)
☐ Crash Rate (uncheck if not relevant)
```

### Step 5: Enable/Disable Events

If you don't track certain events:
1. Find the event in the table
2. **Uncheck** the checkbox in the first column
3. The event is now disabled and won't be processed

### Step 6: Configure Settings

Click the **"Settings"** tab:
- Toggle **"Enable SDK Tracking"** on/off
- Set **"Refresh Interval"** (how often metrics recalculate)
- Set **"Data Retention"** (how long to keep historical data)

### Step 7: Save Configuration

Click the **"Save All"** button at the top right.

Your configuration is now saved and will be used for metric calculations!

---

## 📥 Import/Export Data (Game Analytics)

### Accessing Import/Export Manager

**URL:** `http://localhost:5173/#/game-analytics-import`

**Menu:** "GA Import/Export"

---

### How to Import Events from Excel

#### Step 1: Download Template

1. Navigate to the Import/Export page
2. In the **"Import Events"** section
3. Click **"Download Import Template"**
4. Save the CSV file

#### Step 2: Fill Template

Open the CSV in Excel and fill in your data:

```csv
Event Name,Event Data (JSON),Created At (ISO),Link ID,Player ID,Device ID
session_start,"{}",2024-01-15T10:00:00Z,your-link-uuid,player-uuid,device-uuid
business_event,"{""amount"":0.99,""currency"":""USD""}",2024-01-15T10:30:00Z,your-link-uuid,player-uuid,device-uuid
```

**Important:**
- Event Name: Must match Game Analytics event names
- Event Data: Must be valid JSON (use double quotes)
- Link ID: Must exist in your database
- Created At: ISO format (YYYY-MM-DDTHH:mm:ssZ)

#### Step 3: Upload File

1. Select the game from dropdown
2. Click **"Choose File"**
3. Select your filled CSV file
4. Click **"Import Events"**

#### Step 4: Review Results

A dialog shows:
- ✅ Number of events imported successfully
- ⚠️ Any errors encountered during import
- 📄 Filename that was processed

---

### How to Export Events to Excel

1. Select the **game** from dropdown
2. Set **start date** and **end date**
3. Click **"Export as CSV"** or **"Export as JSON"**
4. File downloads automatically
5. Open in Excel for analysis

---

### How to Export Metrics to Excel

1. Select the **game** from dropdown
2. Set **start date** and **end date**
3. Click **"Export Metrics to CSV"**
4. CSV file downloads with all calculated metrics
5. Open in Excel to view metrics

---

## 🎯 Common Configuration Scenarios

### Scenario 1: Setup Hyper Rabbit for Android

```
1. Navigate to Advanced Config
2. Select SDK: Hyper Rabbit
3. Select Platform: Android
4. Review default mappings:
   - session_start → DAU, MAU
   - iap_successful → Revenue, Gross Revenue
   - level_complete → Win Rate
5. Edit if needed
6. Save All
```

### Scenario 2: Setup Game Analytics for iOS

```
1. Navigate to Advanced Config
2. Select SDK: Game Analytics
3. Select Platform: iOS
4. Review default mappings:
   - business_event → Revenue, ARPDAU, ARPPU
   - progression_event → Starts, Completes, Fails, Win %
   - resource_event → Flow, Source, Sink
5. Edit if needed
6. Save All
```

### Scenario 3: Disable Unused Events

```
1. Go to Event-Metric Mapping tab
2. Find events you don't use (e.g., ad_clicked)
3. Uncheck the checkbox
4. Event is now disabled
5. Save All
```

### Scenario 4: Customize Metrics for Event

```
1. Find event in mapping table
2. Click Edit button
3. Dialog opens with all available metrics
4. Check only the metrics you want:
   Example for session_start:
   ☑️ DAU
   ☑️ MAU
   ☐ Session Length (disable if not needed)
5. Save Mapping
6. Save All
```

---

## 📊 View Statistics

### Import Statistics

1. Navigate to **"GA Import/Export"** page
2. Select a game
3. Click **"View Import Statistics"**
4. See:
   - Total events imported
   - Event breakdown by type
   - Date range of imported data

### Configuration Statistics

1. Navigate to **"Advanced Config"** page
2. Click **"Settings"** tab
3. See:
   - Total events
   - Enabled events
   - Total metrics
   - Mapped metrics

---

## 🚀 Quick Start Workflow

### For First-Time Setup:

```
Step 1: Set Admin Role
   → Navigate to "Set Admin Role (Testing)"
   → Set your role to "admin"

Step 2: Access Configuration
   → Click "Advanced Config" in menu
   → OR navigate to /#/advanced-report-configuration

Step 3: Select SDK
   → Choose Hyper Rabbit or Game Analytics
   → Choose Android or iOS

Step 4: Review Mappings
   → See all events and their associated metrics
   → Defaults are already optimized

Step 5: Import Data (Optional)
   → Navigate to "GA Import/Export"
   → Download template
   → Fill with your data
   → Upload and import

Step 6: View Metrics
   → Metrics calculate automatically
   → View in Developer/Publisher dashboards
   → Export to Excel for analysis
```

---

## 🎨 UI Navigation Map

```
Dashboard (Home)
    ├─ Developer Dashboard
    ├─ Publisher Dashboard
    └─ Admin Dashboard
        ↓
Admin Menu (Sidebar)
    ├─ Event Logs
    ├─ Report Configuration          → Standard config
    ├─ Advanced Config ⭐            → Event-metric mapping
    ├─ SDK Configuration             → SDK info viewer
    ├─ GA Import/Export ⭐           → Import/export manager
    └─ Set Admin Role (Testing)
```

---

## 🔍 Troubleshooting

### Issue: Advanced Config page not loading

**Solution:**
1. Verify you're logged in as admin
2. Check browser console for errors
3. Try direct URL: `http://localhost:5173/#/advanced-report-configuration`
4. Refresh the page
5. Clear browser cache if needed

### Issue: Can't see admin menu items

**Solution:**
1. Set your role to "admin" using "Set Admin Role (Testing)"
2. Logout and login again
3. Verify localStorage has: `localStorage.getItem('userRole')` === 'admin'

### Issue: Configuration not saving

**Solution:**
1. Click "Save All" button
2. Check browser console for errors
3. Verify localStorage is enabled in browser
4. Try exporting config as backup

### Issue: Import not working

**Solution:**
1. Ensure game is selected
2. Check CSV format matches template
3. Verify linkId exists in database
4. Check JSON in eventData column is valid
5. Review import errors in result dialog

---

## 📚 Documentation Reference

| Task | See Document |
|------|--------------|
| **Configure Events/Metrics** | ADVANCED_REPORT_CONFIGURATION_GUIDE.md |
| **Import/Export Data** | GAME_ANALYTICS_IMPLEMENTATION_GUIDE.md |
| **API Usage** | API_REFERENCE.md |
| **Quick Reference** | ADMIN_QUICK_REFERENCE.md |

---

## ✅ Verification Checklist

Before using in production:

- [ ] Backend running: `npm start` in hp-backend-main/
- [ ] Frontend running: `npm start` in hp-dashboard-main/
- [ ] Logged in as admin user
- [ ] Can access /#/advanced-report-configuration
- [ ] Can see Event-Metric Mapping table
- [ ] Can edit event mappings
- [ ] Can save configurations
- [ ] Can access /#/game-analytics-import
- [ ] Can download import template
- [ ] Can export events/metrics

---

## 🎯 Quick Commands

### Access URLs

```bash
# Advanced Configuration
http://localhost:5173/#/advanced-report-configuration

# With SDK pre-selected
http://localhost:5173/#/advanced-report-configuration?sdk=hyper_rabbit&platform=Android

# Standard Configuration
http://localhost:5173/#/report-configuration

# SDK Info
http://localhost:5173/#/sdk-configuration

# Import/Export
http://localhost:5173/#/game-analytics-import
```

### Test Backend APIs

```bash
# Test Hyper Rabbit metrics
curl "http://localhost:3000/hyper-rabbit/metrics/GAME_ID?startDate=2024-01-01&endDate=2024-01-31"

# Test Game Analytics metrics
curl "http://localhost:3000/game-analytics/metrics/GAME_ID?startDate=2024-01-01&endDate=2024-01-31"

# Download import template
curl "http://localhost:3000/game-analytics/import/template" -o template.csv

# Export metrics
curl "http://localhost:3000/game-analytics/export/metrics/GAME_ID?startDate=2024-01-01&endDate=2024-01-31" -o metrics.csv
```

---

## 🎊 Summary

### What You Can Do:

1. ✅ **Configure SDK Types** - Select Hyper Rabbit or Game Analytics
2. ✅ **Select Platform** - Android or iOS
3. ✅ **Edit Event Mappings** - Choose which metrics calculate from each event
4. ✅ **Enable/Disable Events** - Control which events are processed
5. ✅ **Import from Excel** - Upload CSV files with event data
6. ✅ **Export to Excel** - Download events and metrics
7. ✅ **View Statistics** - See import stats and event breakdowns
8. ✅ **Manage Configuration** - Save, export, reset options

### Menu Items in Sidebar:

When logged in as **admin**, you'll see:
- 📊 Event Logs
- 📋 Report Configuration
- ⚙️ **Advanced Config** ⭐
- 🔧 **SDK Configuration**
- 📥 **GA Import/Export** ⭐

---

## 🚀 Start Using

```bash
# 1. Start frontend
cd hp-dashboard-main/hp-dashboard-main
npm start

# 2. Open browser
http://localhost:5173

# 3. Login as admin
# (Use admin role setter if needed)

# 4. Access configuration
Click "Advanced Config" in menu
OR
Navigate to: /#/advanced-report-configuration
```

---

**Status:** ✅ All pages registered and accessible!

🎉 **Your advanced configuration system is ready to use!** 🎉






