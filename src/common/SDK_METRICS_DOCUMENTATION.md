# SDK Metrics Documentation

## Overview

This document provides a comprehensive overview of all metrics tracked by **Hyper Rabbit SDK** and **Game Analytics SDK** for **Android** and **iOS** platforms.

---

## Table of Contents

1. [Hyper Rabbit SDK Metrics](#hyper-rabbit-sdk-metrics)
2. [Game Analytics SDK Metrics](#game-analytics-sdk-metrics)
3. [Event Categories](#event-categories)
4. [Report Configurations](#report-configurations)

---

## Hyper Rabbit SDK Metrics

### Engagement Metrics

| Metric | Formula | Event Source | Description |
|--------|---------|--------------|-------------|
| **DAU (Daily Active Users)** | `COUNT(DISTINCT user_id) on a given day` | session_start event | Unique users per day |
| **MAU (Monthly Active Users)** | `Unique users over 30 days` | session_start event | Unique users over 30 days |
| **Session Length** | `session_end - session_start` | session_start and session_end events | Duration of gameplay session |
| **Level Attempts** | `level_start count` | level_start event | Total number of level starts |
| **Win Rate** | `level_complete / (level_complete + level_fail)` | level_complete and level_fail events | Level completion percentage |
| **New Users** | `New users count per day` | User registration | New users per day |

### Monetization Metrics

| Metric | Formula | Event Source | Description |
|--------|---------|--------------|-------------|
| **CPI (Cost Per Install)** | `CPI = Ad Spend / Installs` | Calculated by number of users | Ad Spend divided by Installs |
| **Revenue** | `Revenue = IAP Revenue + Ad Revenue` | iap_successful event | Total revenue from IAP and Ads |
| **ROAS Dx** | `ROAS Dx = (X days Revenue / Spend of Installs) * 100` | iap_successful event | Return on Ad Spend for X days |
| **Gross Revenue** | `Gross Revenue = ∑ (IAP Revenue + Ads Revenue)` | iap_successful event | Sum of all revenue |

### Technical/Performance Metrics

| Metric | Formula | Event Source | Description |
|--------|---------|--------------|-------------|
| **Crash Rate** | `Crashes = (Crashes / Sessions) * 100` | error_logged and session_start events | Application crash rate |
| **App Boot Time** | `Time taken for SDK initialization` | SDK init event | SDK initialization time |
| **Users Affected by Errors** | `Total users affected count by error event` | error_logged event | Count of users with errors |

---

## Game Analytics SDK Metrics

### Engagement Metrics

| Metric | Formula | Event Source | Description |
|--------|---------|--------------|-------------|
| **DAU** | `DISTINCT user_id per day` | session_start | Daily Active Users |
| **WAU** | `DISTINCT user_id over 7 days` | session_start | Weekly Active Users |
| **MAU** | `DISTINCT user_id over 30 days` | session_start | Monthly Active Users |
| **Average Session Length** | `SUM(session_length) / session_count` | session_start and session_end | Average seconds per session |
| **Playtime per Session** | `AVG(session_length)` | session_start and session_end | Average session playtime |
| **Playtime per User** | `SUM(session_length) / DISTINCT(user_id)` | session_start and session_end | Average user playtime |
| **New Users** | `Count of new users` | session_start (first time) | New users per day |
| **Number of Sessions** | `Count of session_start` | session_start | Total sessions |
| **DAU (New vs. Returning)** | `New Users / DAU` | session_start and user data | Percentage of new users |
| **Attempts** | `Count of progression_event` | progression_event | Level attempts count |
| **Completes** | `Count of progression_event (Complete)` | progression_event (Complete) | Level completion count |
| **Fails** | `Count of progression_event (Fail)` | progression_event (Fail) | Level failure count |
| **Complete Score** | `Score from progression_event` | progression_event (Complete) | Score on level completion |
| **Fail Score** | `Score from progression_event` | progression_event (Fail) | Score on level failure |
| **Starts** | `Count of progression_event (Start)` | progression_event (Start) | Level start count |
| **Win Percentage** | `Completes / (Completes + Fails)` | progression_event | Level completion percentage |

### Monetization Metrics

| Metric | Formula | Event Source | Description |
|--------|---------|--------------|-------------|
| **ARPDAU** | `Revenue / DAU` | business_event and session_start | Average revenue per daily active user |
| **ARPPU** | `Revenue / Paying Users` | business_event | Average revenue per paying user |
| **Revenue** | `SUM(business_event.amount)` | business_event | Total transaction revenue |
| **Revenue per Transaction** | `SUM(amount) / COUNT(business_event)` | business_event | Average transaction value |
| **Conversion Rate** | `First-time Purchasers / DAU` | business_event | First-time purchasers percentage |
| **Converting Users** | `Count of first business_event per user` | business_event | First-time purchasers count |
| **Paying Users** | `DISTINCT user_id with business_event` | business_event | Users who made purchases |
| **Transactions** | `COUNT(business_event)` | business_event | Transaction count |

### Retention Metrics

| Metric | Formula | Event Source | Description |
|--------|---------|--------------|-------------|
| **Retention** | `Returning Users / Installed Users` | session_start | User retention percentage |
| **Returning Users** | `Count of returning sessions` | session_start | Users who returned after X days |

### Economy/Resource Metrics

| Metric | Formula | Event Source | Description |
|--------|---------|--------------|-------------|
| **Flow** | `SUM(earned) - SUM(spent)` | resource_event | Currency balance |
| **Sink** | `SUM(resource_event where flowType=Loss)` | resource_event (Loss) | Currency spent/lost |
| **Source** | `SUM(resource_event where flowType=Gain)` | resource_event (Gain) | Currency gained/earned |

### Technical/Performance Metrics

| Metric | Formula | Event Source | Description |
|--------|---------|--------------|-------------|
| **Error Count** | `Count of error_event` | error_event | Count of error events |
| **Users Affected by Errors** | `DISTINCT user_id with error_event` | error_event | Users with error events |

---

## Event Categories

### Hyper Rabbit SDK Events

#### A. Gameplay Events
- `session_start` - When the player opens the game
- `session_end` - When the player closes the game or goes to background
- `gameplay_start` - When gameplay starts or resumes
- `gameplay_stop` - When gameplay ends or pauses
- `level_start` - When a new level or round begins
- `level_complete` - When a player finishes a level successfully
- `level_fail` - When a player fails a level
- `revive_used` - When player revives after death
- `tutorial_step` - Logs each tutorial step
- `menu_navigated` - When player opens inventory, shop, etc.

#### B. Monetization Events - IAP
- `iap_initiated` - When a player taps "Buy" on an item
- `iap_successful` - When a purchase is completed successfully
- `iap_failed` - When purchase fails (cancelled or errors)
- `iap_consumed` - When the bought item is used

#### C. Monetization Events - Ads
- `ad_started` - An ad begins playing
- `ad_completed` - Player finishes watching the ad
- `ad_skipped` - Player skips the ad before the end
- `ad_failed` - Ad failed to load or play
- `ad_clicked` - Player taps on the ad

#### D. Economy Events
- `currency_earned` - When the player gains coins/gems/etc.
- `currency_spent` - When the player spends coins/gems/etc.

#### E. Error & Technical Events
- `error_logged` - When a game error is detected
- `fps_report` - Report frames per second (smoothness)
- `memory_usage` - Helps track memory issues

### Game Analytics SDK Events

#### Ad Events
- `ad_event` - Track ad interactions
  - Actions: Ad Clicked, Ad Show, Ad Failed, Reward Received
  - Types: Video, Rewarded Video, Interstitial, Banner, Playable, Offer Wall

#### Business Events
- `business_event` - Track real money transactions

#### Design Events
- `design_event` - Track custom game concepts

#### Error Events
- `error_event` - Log errors or warnings
  - Severity: Info, Debug, Warning, Error, Critical

#### Impression Events
- `impression_event` - Track ad impressions

#### Progression Events
- `progression_event` - Track level progression
  - Status: Start, Complete, Fail

#### Resource Events
- `resource_event` - Track virtual currency
  - Flow Type: Gain, Loss

#### Performance Events
- `performance_event` - Track system performance

#### Session Events
- `sdk_init` - Track app boot time
- `session_start` - Track session start
- `session_end` - Track session end

---

## Report Configurations

### Hyper Rabbit SDK Reports

#### Android Platform
1. **Engagement Metrics**
   - DAU, MAU, Session Length, Level Attempts, Win Rate, New Users
   - Refresh: 60 minutes | Retention: 365 days

2. **Monetization**
   - Revenue, Gross Revenue, CPI, ROAS Dx
   - Refresh: 60 minutes | Retention: 365 days

3. **Retention**
   - Retention D1/D7/D30, DAU, New Users
   - Refresh: 120 minutes | Retention: 365 days

4. **Performance**
   - Crash Rate, App Boot Time, Users Affected by Errors, FPS, Memory Usage
   - Refresh: 30 minutes | Retention: 90 days

#### iOS Platform
Same reports as Android with iOS-specific data

### Game Analytics SDK Reports

#### Android Platform
1. **Engagement Metrics**
   - DAU, MAU, WAU, Average Session Length, Playtime per Session/User, New Users, Number of Sessions
   - Refresh: 60 minutes | Retention: 365 days

2. **Monetization**
   - Revenue, ARPDAU, ARPPU, Conversion Rate, Converting Users, Paying Users, Transactions, Revenue per Transaction
   - Refresh: 60 minutes | Retention: 365 days

3. **Progression**
   - Starts, Completes, Fails, Attempts, Win Percentage, Complete Score, Fail Score
   - Refresh: 60 minutes | Retention: 365 days

4. **Retention**
   - Retention, Returning Users, DAU (New vs. Returning)
   - Refresh: 120 minutes | Retention: 365 days

5. **Virtual Economy**
   - Flow, Sink, Source
   - Refresh: 60 minutes | Retention: 365 days

6. **Performance**
   - Error Count, Users Affected by Errors
   - Refresh: 30 minutes | Retention: 90 days

#### iOS Platform
Same reports as Android with iOS-specific data

---

## Usage

### Accessing SDK Configuration
Admin users can access the SDK Configuration page to:
- View all events, metrics, and reports for each SDK
- Filter by SDK type (Hyper Rabbit or Game Analytics)
- Filter by platform (Android or iOS)
- Export configuration as JSON

### Developer Dashboard
Developers can access SDK-specific reports from the Reports Hub:
- Select platform (Android/iOS)
- Choose SDK type
- View pre-configured reports with relevant metrics
- Export data as CSV, PDF, or Excel

### Publisher Dashboard
Publishers have access to aggregated metrics across all SDKs and platforms for comprehensive business insights.

---

## Notes

- All metrics are calculated based on tracked events
- Refresh intervals are configurable per report
- Data retention periods vary by metric category
- Both SDKs support Android and iOS platforms
- Web platform support is available for standard metrics only (not SDK-specific)





