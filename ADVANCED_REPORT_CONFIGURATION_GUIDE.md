# Advanced Report Configuration Guide

## 🎯 Overview

The Advanced Report Configuration system allows administrators to:
- Select SDK types (Hyper Rabbit or Game Analytics)
- Configure event-to-metric mappings
- Enable/disable specific events
- Customize metrics calculated from each event
- Configure settings per platform (Android/iOS)

---

## 🔧 Features

### 1. **SDK Type Selection**
Choose between:
- **Hyper Rabbit SDK** (16 events, 14 metrics)
- **Game Analytics SDK** (11 events, 32 metrics)

### 2. **Platform Selection**
Configure separately for:
- **Android**
- **iOS**

### 3. **Event-Metric Mapping**
- View all events for selected SDK and platform
- See which metrics are associated with each event
- Edit associations to customize calculations
- Enable/disable specific events

### 4. **Metric Configuration**
- View all available metrics
- See formulas and event sources
- Organized by category (engagement, monetization, etc.)

### 5. **Settings Management**
- Configure refresh intervals
- Set data retention periods
- Enable/disable entire SDK tracking
- Export/import configurations

---

## 📍 Accessing the Configuration

### Method 1: Direct Navigation
Navigate to: `/admin/advanced-report-configuration`

### Method 2: From Report Configuration Page
1. Go to `/admin/report-configuration`
2. Click "SDK Types" tab
3. Click "Configure Events & Metrics" for any SDK

---

## 🎨 User Interface

### **Tab 1: Event-Metric Mapping**

**Table View:**
```
┌──────────────────────────────────────────────────────────────┐
│ ☑ | Event Name    | Category    | Metrics          | Status │
├──────────────────────────────────────────────────────────────┤
│ ☑ | session_start | engagement  | DAU, MAU, +2     | ✅     │
│ ☑ | iap_successful| monetization| Revenue, ARPDAU  | ✅     │
│ ☐ | error_logged  | technical   | Error Count      | ❌     │
└──────────────────────────────────────────────────────────────┘
```

**Features:**
- ✅ Checkbox to enable/disable events
- ✅ View associated metrics
- ✅ Edit button to modify mappings
- ✅ Status indicator

### **Tab 2: Event List**

**Organized by Category:**
```
📊 Gameplay Events (10)
  ├─ session_start
  ├─ session_end
  ├─ level_start
  └─ ...

💰 Monetization Events (9)
  ├─ iap_successful
  ├─ ad_completed
  └─ ...
```

### **Tab 3: Metric List**

**Organized by Category:**
```
👥 Engagement Metrics (11)
  ├─ DAU - COUNT(DISTINCT user_id) per day
  ├─ MAU - Unique users over 30 days
  └─ ...

💵 Monetization Metrics (8)
  ├─ Revenue - SUM(business_event.amount)
  ├─ ARPDAU - Revenue / DAU
  └─ ...
```

### **Tab 4: Settings**

**Configuration Options:**
- Enable SDK Tracking (On/Off)
- Refresh Interval (minutes)
- Data Retention (days)
- Statistics display

---

## 🔧 How to Configure Event-Metric Mappings

### Step 1: Select SDK and Platform

1. Choose SDK Type (Hyper Rabbit or Game Analytics)
2. Choose Platform (Android or iOS)
3. Click "Event-Metric Mapping" tab

### Step 2: View Current Mappings

The table shows all events and their associated metrics:
- **Event Name:** The event being tracked
- **Category:** Event category (gameplay, monetization, etc.)
- **Associated Metrics:** Metrics calculated from this event
- **Status:** Enabled/Disabled

### Step 3: Edit Mapping

1. Click the **Edit** button (✏️) next to an event
2. A dialog opens showing all available metrics
3. Check/uncheck metrics to associate with this event
4. Click **Save Mapping**

### Step 4: Enable/Disable Events

- Use the checkbox in the first column to enable/disable events
- Disabled events won't be processed for metric calculations

### Step 5: Save Configuration

- Click **Save All** button to persist changes
- Configuration saved to localStorage
- Applied to metric calculations immediately

---

## 📊 Event-to-Metric Mapping Examples

### Example 1: session_start Event

**Default Mapping:**
- ✅ DAU (Daily Active Users)
- ✅ MAU (Monthly Active Users)
- ✅ Number of Sessions
- ✅ Crash Rate (denominator)

**Custom Mapping (User can add/remove):**
- Can associate additional metrics
- Can remove metrics if not needed

### Example 2: business_event Event

**Default Mapping:**
- ✅ Revenue
- ✅ ARPDAU
- ✅ ARPPU
- ✅ Transactions
- ✅ Conversion Rate
- ✅ Paying Users

### Example 3: progression_event Event

**Default Mapping:**
- ✅ Starts
- ✅ Completes
- ✅ Fails
- ✅ Attempts
- ✅ Win Percentage

---

## 🎯 Configuration Storage

### Storage Format (localStorage)

```json
{
  "id": "hyper_rabbit-Android",
  "sdkType": "hyper_rabbit",
  "platform": "Android",
  "enabled": true,
  "eventMetricMappings": [
    {
      "eventName": "session_start",
      "sdkType": "hyper_rabbit",
      "platform": "Android",
      "associatedMetrics": ["hr_dau", "hr_mau", "hr_session_length"],
      "enabled": true
    },
    {
      "eventName": "iap_successful",
      "sdkType": "hyper_rabbit",
      "platform": "Android",
      "associatedMetrics": ["hr_revenue", "hr_gross_revenue"],
      "enabled": true
    }
  ],
  "refreshInterval": 60,
  "dataRetention": 365
}
```

---

## 🔄 How Configurations Are Used

### 1. Metric Calculation

When calculating metrics, the backend uses the configured mappings:

```typescript
// Example: Calculate DAU
// Check if session_start event is enabled
// Check if DAU metric is associated with session_start
// If yes, query EventLog for session_start events
// Calculate DAU from those events
```

### 2. Report Generation

Reports use the configured metrics:

```typescript
// Example: Generate Engagement Report
// Get all events enabled for "engagement" category
// Get all metrics associated with those events
// Query data and generate report
```

### 3. Dashboard Display

Dashboards show metrics based on configuration:

```typescript
// Example: Developer Dashboard
// Load configuration for current SDK and platform
// Show only enabled metrics
// Update based on refresh interval
```

---

## 📋 Configuration Scenarios

### Scenario 1: Disable Specific Events

**Use Case:** You don't track certain events in your game

**Steps:**
1. Go to Event-Metric Mapping tab
2. Uncheck the event you don't use
3. Click Save All

**Result:** That event won't be processed for metrics

### Scenario 2: Add Custom Metric to Event

**Use Case:** You want to calculate additional metrics from an event

**Steps:**
1. Click Edit button for the event
2. Check additional metrics you want
3. Save mapping

**Result:** Those metrics will now be calculated from that event

### Scenario 3: Platform-Specific Configuration

**Use Case:** Android and iOS need different metric configurations

**Steps:**
1. Configure Android platform settings
2. Switch to iOS platform
3. Configure iOS platform settings separately
4. Save All

**Result:** Each platform has its own configuration

### Scenario 4: SDK-Specific Setup

**Use Case:** Only use Game Analytics for certain games

**Steps:**
1. Select Game Analytics SDK
2. Configure event mappings
3. Select Hyper Rabbit SDK
4. Disable entirely or configure separately

**Result:** Each SDK can be configured independently

---

## 🎯 Best Practices

### 1. **Start with Defaults**
- Default configurations are optimized for each SDK
- Only modify if you have specific requirements

### 2. **Test After Changes**
- Verify metrics calculate correctly after configuration changes
- Check dashboard displays expected values

### 3. **Document Custom Mappings**
- Keep notes on why you changed default mappings
- Export configuration as backup

### 4. **Regular Reviews**
- Review configurations quarterly
- Remove unused events/metrics
- Add new events as game evolves

### 5. **Platform Consistency**
- Keep Android and iOS configurations similar unless necessary
- Makes cross-platform analysis easier

---

## 🔍 Troubleshooting

### Issue: Metrics not calculating

**Check:**
1. Is the SDK tracking enabled in Settings?
2. Is the event enabled in Event-Metric Mapping?
3. Is the metric associated with the event?
4. Does EventLog table have data for that event?

### Issue: Configuration not saving

**Check:**
1. Click "Save All" button
2. Check browser console for errors
3. Verify localStorage is enabled
4. Try exporting configuration as backup

### Issue: Wrong metrics showing

**Check:**
1. Verify SDK type is correct
2. Check platform selection
3. Review event-metric mappings
4. Reset to defaults if needed

---

## 📚 Configuration Options

### SDK-Level Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Enabled** | Enable/disable entire SDK | true |
| **Refresh Interval** | How often to recalculate metrics (minutes) | 60 |
| **Data Retention** | How long to keep historical data (days) | 365 |

### Event-Level Settings

| Setting | Description |
|---------|-------------|
| **Enabled** | Process this event type | true |
| **Associated Metrics** | Which metrics to calculate | Auto-detected |

### Metric-Level Information

| Field | Description |
|-------|-------------|
| **Name** | Metric display name |
| **Formula** | Calculation formula |
| **Event Source** | Which events provide data |
| **Category** | Metric category |

---

## 🎨 UI Components

### Selection Panel
```
┌─────────────────────────────────────────────┐
│ SDK Type: [Hyper Rabbit ▼]                 │
│ Platform: [Android ▼]                      │
│ Status: ℹ️ Configuring Hyper Rabbit on Android │
└─────────────────────────────────────────────┘
```

### Event-Metric Mapping Table
```
☑️ Event | Category | Metrics (chips) | Status | [Edit]
```

### Edit Dialog
```
┌─────────────────────────────────────────────┐
│ Edit Metric Mapping: session_start          │
├─────────────────────────────────────────────┤
│ Select metrics to calculate:                │
│ ☑️ DAU (Daily Active Users)                 │
│ ☑️ MAU (Monthly Active Users)               │
│ ☐ Session Length                            │
│ ☐ Error Count                               │
│                                              │
│ Selected: 2 metrics                         │
│ [Cancel] [Save Mapping]                     │
└─────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Access Configuration

```
http://localhost:5173/#/admin/advanced-report-configuration
```

### 2. Select SDK and Platform

```typescript
SDK: Hyper Rabbit
Platform: Android
```

### 3. Review Mappings

Check the Event-Metric Mapping tab to see current configuration

### 4. Edit as Needed

Click Edit on any event to modify associated metrics

### 5. Save Configuration

Click "Save All" to persist changes

---

## 📊 Configuration by SDK

### Hyper Rabbit SDK Configuration

**Events (16):**
- Gameplay: 10 events
- Monetization: 9 events (IAP + Ads)
- Economy: 2 events
- Technical: 3 events

**Metrics (14):**
- Engagement: 6 metrics
- Monetization: 6 metrics
- Technical: 2 metrics

**Default Mappings:**
- session_start → DAU, MAU
- iap_successful → IAP Revenue, Gross Revenue
- level_start → Level Attempts
- level_complete → Win Rate
- error_logged → Crash Rate, Users Affected

### Game Analytics SDK Configuration

**Events (11):**
- ad_event
- business_event
- design_event
- error_event
- impression_event
- progression_event
- resource_event
- performance_event
- sdk_init
- session_start
- session_end

**Metrics (32):**
- Engagement: 11 metrics
- Monetization: 8 metrics
- Progression: 5 metrics
- Economy: 3 metrics
- Technical: 2 metrics
- Retention: 3 metrics

**Default Mappings:**
- session_start → DAU, MAU, WAU, Sessions
- business_event → Revenue, ARPDAU, ARPPU, Transactions
- progression_event → Starts, Completes, Fails, Win %
- resource_event → Flow, Source, Sink
- error_event → Error Count, Users Affected

---

## 📥 Export/Import Configuration

### Export Configuration

1. Select SDK and Platform
2. Click "Export Config" button
3. JSON file downloads
4. Save as backup or share with team

**Export Format:**
```json
{
  "id": "hyper_rabbit-Android",
  "sdkType": "hyper_rabbit",
  "platform": "Android",
  "enabled": true,
  "eventMetricMappings": [...],
  "refreshInterval": 60,
  "dataRetention": 365
}
```

### Import Configuration

1. Prepare configuration JSON file
2. Load in browser
3. Parse and apply settings
4. Save All to persist

---

## 🎯 Use Cases

### Use Case 1: Custom Game without IAP

**Scenario:** Your game doesn't have in-app purchases

**Configuration:**
1. Select Hyper Rabbit SDK
2. Disable `iap_initiated`, `iap_successful`, `iap_failed`, `iap_consumed` events
3. Save

**Result:** IAP events won't be processed, focusing on other metrics

### Use Case 2: Focus on Engagement Only

**Scenario:** You only want engagement metrics

**Configuration:**
1. Go to each monetization event
2. Uncheck monetization metrics
3. Keep only engagement metrics
4. Save

**Result:** Only engagement metrics calculated

### Use Case 3: Platform-Specific Events

**Scenario:** Android has different ad providers than iOS

**Configuration:**
1. Configure Android with specific ad events
2. Switch to iOS
3. Configure iOS with different ad events
4. Save

**Result:** Each platform calculates appropriate metrics

---

## 🔒 Permissions

**Required Role:** Admin or Administrator

**Access Control:**
- Only admin users can access this page
- Configuration changes require admin privileges
- Regular users see read-only dashboard data

---

## 📊 Impact on Dashboards

### Developer Dashboard

Configured metrics appear in:
- Portfolio KPIs section
- Game cards
- Report Hub
- Export data

### Publisher Dashboard

Aggregated metrics from configured SDKs:
- Gross Revenue (from enabled revenue events)
- Engagement metrics (from enabled session events)
- Technical metrics (from enabled error events)

### Reports

Report templates use configured metrics:
- Only enabled metrics appear in reports
- Disabled events don't contribute to calculations
- Custom mappings reflected in report data

---

## ⚙️ Configuration Persistence

### Storage

**Location:** Browser localStorage

**Key:** `sdkConfigurations`

**Scope:** Per-browser (not shared across devices)

### Backup

**Recommended:**
1. Export configuration regularly
2. Store JSON files in version control
3. Share with team members
4. Re-import on new machines

---

## 🧪 Testing Configuration Changes

### 1. Make Configuration Changes

Edit event-metric mappings as needed

### 2. Save Configuration

Click "Save All" button

### 3. Verify in Backend

```bash
# Check if metrics calculate correctly
GET /hyper-rabbit/metrics/:gameId?startDate=...&endDate=...
GET /game-analytics/metrics/:gameId?startDate=...&endDate=...
```

### 4. Verify in Dashboard

Navigate to Developer/Publisher dashboard and verify metrics display correctly

### 5. Check Reports

Generate reports and verify they use correct metrics

---

## 🎓 Advanced Features

### 1. Bulk Enable/Disable

**Future Enhancement:**
- Select multiple events
- Enable/disable all at once
- Apply to multiple platforms

### 2. Metric Dependencies

**Future Enhancement:**
- Show which metrics depend on others
- Warn when disabling required events
- Automatic dependency resolution

### 3. Configuration Templates

**Future Enhancement:**
- Save custom configurations as templates
- Quick-apply templates to other games
- Share templates across team

### 4. Real-time Validation

**Future Enhancement:**
- Validate configuration against EventLog data
- Show warnings for missing events
- Suggest optimizations

---

## 📚 Related Documentation

- **SDK_METRICS_DOCUMENTATION.md** - Complete metrics reference
- **API_REFERENCE.md** - Backend API documentation
- **HYPER_RABBIT_EVENTLOG_MAPPING.md** - Hyper Rabbit details
- **GAME_ANALYTICS_IMPLEMENTATION_GUIDE.md** - Game Analytics details

---

## ✅ Checklist for Configuration

Before finalizing configuration:

- [ ] Selected correct SDK type for your game
- [ ] Selected correct platform (Android/iOS)
- [ ] Reviewed all event mappings
- [ ] Enabled only events your game tracks
- [ ] Associated correct metrics with events
- [ ] Set appropriate refresh interval
- [ ] Set data retention period
- [ ] Saved configuration
- [ ] Exported backup
- [ ] Tested metrics calculation
- [ ] Verified dashboard display

---

## 🎊 Summary

The Advanced Report Configuration system provides:

✅ **Flexible SDK Selection** - Choose Hyper Rabbit or Game Analytics  
✅ **Platform-Specific Config** - Separate settings for Android/iOS  
✅ **Event Management** - Enable/disable specific events  
✅ **Metric Customization** - Choose which metrics to calculate  
✅ **Easy Management** - Intuitive UI for all operations  
✅ **Backup/Restore** - Export/import configurations  
✅ **Real-time Updates** - Changes apply immediately  

---

**Access:** `/admin/advanced-report-configuration`

**Status:** ✅ Ready to Use

Configure your SDK metrics and events exactly how you need them! 🎯






