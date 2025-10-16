// SDK-Specific Report Configuration for Hyper Rabbit and Game Analytics
// Based on SDK tracking specifications

export type SDKType = 'hyper_rabbit' | 'game_analytics';
export type PlatformType = 'iOS' | 'Android' | 'Web';

export interface SDKMetric {
  id: string;
  name: string;
  description: string;
  formula?: string;
  eventSource: string;
  category: 'engagement' | 'monetization' | 'retention' | 'performance' | 'technical';
  sdkTypes: SDKType[];
  platforms: PlatformType[];
}

export interface SDKEvent {
  eventName: string;
  category: string;
  description: string;
  whenItHappens: string;
  whyItMatters: string;
  eventData: Record<string, any>;
  sdkTypes: SDKType[];
  platforms: PlatformType[];
}

export interface SDKReportConfig {
  id: string;
  name: string;
  description: string;
  sdkType: SDKType;
  platforms: PlatformType[];
  category: 'developer' | 'publisher';
  metrics: string[];
  events: string[];
  chartType: 'line' | 'bar' | 'area' | 'pie' | 'table' | 'combo';
  enabled: boolean;
  refreshInterval: number;
  dataRetention: number;
}

// ==================== HYPER RABBIT SDK EVENTS ====================

export const HYPER_RABBIT_EVENTS: SDKEvent[] = [
  // A. Gameplay Events
  {
    eventName: 'session_start',
    category: 'gameplay',
    description: 'When the player opens the game',
    whenItHappens: 'Game launch',
    whyItMatters: 'Tracks how often players launch the game',
    eventData: {
      category: 'string',
      gameplayEventData: {}
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'session_end',
    category: 'gameplay',
    description: 'When the player closes the game or goes to background',
    whenItHappens: 'Game close or background',
    whyItMatters: 'Helps calculate session length',
    eventData: {
      category: 'string',
      gameplayEventData: {}
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'gameplay_start',
    category: 'gameplay',
    description: 'When gameplay starts or resumes',
    whenItHappens: 'Level begins',
    whyItMatters: 'Measures active play time',
    eventData: {
      category: 'string',
      gameplayEventData: {}
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'gameplay_stop',
    category: 'gameplay',
    description: 'When gameplay ends or pauses',
    whenItHappens: 'Level ends or pauses',
    whyItMatters: 'Completes the gameplay session',
    eventData: {
      category: 'string',
      gameplayEventData: {}
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'level_start',
    category: 'gameplay',
    description: 'When a new level or round begins',
    whenItHappens: 'Level start',
    whyItMatters: 'Tracks engagement with content',
    eventData: {
      category: 'string',
      gameplayEventData: {}
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'level_complete',
    category: 'gameplay',
    description: 'When a player finishes a level successfully',
    whenItHappens: 'Level completion',
    whyItMatters: 'Helps track skill progression and game balance',
    eventData: {
      category: 'string',
      gameplayEventData: {}
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'level_fail',
    category: 'gameplay',
    description: 'When a player fails a level',
    whenItHappens: 'Level failure',
    whyItMatters: 'Indicates difficulty or friction points',
    eventData: {
      category: 'string',
      gameplayEventData: {}
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'revive_used',
    category: 'gameplay',
    description: 'When player revives after death',
    whenItHappens: 'Player revive',
    whyItMatters: 'Used to evaluate power-ups or monetization offers',
    eventData: {
      category: 'string',
      gameplayEventData: {}
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'tutorial_step',
    category: 'gameplay',
    description: 'Logs each tutorial step',
    whenItHappens: 'Tutorial progression',
    whyItMatters: 'Measures new player onboarding',
    eventData: {
      category: 'string',
      gameplayEventData: {
        tutorialType: 'string',
        step: 'number',
        totalStep: 'number'
      }
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'menu_navigated',
    category: 'gameplay',
    description: 'When player opens inventory, shop, etc.',
    whenItHappens: 'Menu navigation',
    whyItMatters: 'Understands UI/UX usage',
    eventData: {
      category: 'string',
      gameplayEventData: {
        menu: 'string'
      }
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },

  // B. Monetization Events - IAP
  {
    eventName: 'iap_initiated',
    category: 'monetization',
    description: 'When a player taps "Buy" on an item',
    whenItHappens: 'Purchase initiation',
    whyItMatters: 'Good for funnel analysis',
    eventData: {
      category: 'string',
      iapEventData: {
        productId: 'string',
        price: 'number',
        currencyCode: 'string',
        platform: 'string',
        receiptSignature: {}
      }
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'iap_successful',
    category: 'monetization',
    description: 'When a purchase is completed successfully',
    whenItHappens: 'Purchase completion',
    whyItMatters: 'Used to calculate revenue',
    eventData: {
      category: 'string',
      iapEventData: {
        productId: 'string',
        price: 'number',
        currencyCode: 'string',
        platform: 'string',
        receiptSignature: {}
      }
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'iap_failed',
    category: 'monetization',
    description: 'When purchase fails (cancelled or errors)',
    whenItHappens: 'Purchase failure',
    whyItMatters: 'Used to debug and analyze lost revenue opportunities',
    eventData: {
      category: 'string',
      iapEventData: {
        productId: 'string',
        price: 'number',
        currencyCode: 'string',
        platform: 'string',
        receiptSignature: {}
      }
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'iap_consumed',
    category: 'monetization',
    description: 'When the bought item is used',
    whenItHappens: 'Item consumption',
    whyItMatters: 'Important for consumables (like coins or boosters)',
    eventData: {
      category: 'string',
      iapEventData: {
        productId: 'string',
        price: 'number',
        currencyCode: 'string',
        platform: 'string',
        receiptSignature: {}
      }
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },

  // B. Monetization Events - Ads
  {
    eventName: 'ad_started',
    category: 'monetization',
    description: 'An ad begins playing',
    whenItHappens: 'Ad start',
    whyItMatters: 'Tracks ad impressions',
    eventData: {
      category: 'string',
      adEventData: {
        adType: 'string',
        adPlacement: 'string',
        adSdkName: 'string',
        duration: 'number',
        failReason: 'string'
      }
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'ad_completed',
    category: 'monetization',
    description: 'Player finishes watching the ad',
    whenItHappens: 'Ad completion',
    whyItMatters: 'Calculates ad revenue',
    eventData: {
      category: 'string',
      adEventData: {
        adType: 'string',
        adPlacement: 'string',
        adSdkName: 'string',
        duration: 'number',
        failReason: 'string'
      }
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'ad_skipped',
    category: 'monetization',
    description: 'Player skips the ad before the end',
    whenItHappens: 'Ad skip',
    whyItMatters: 'Measures ad engagement',
    eventData: {
      category: 'string',
      adEventData: {
        adType: 'string',
        adPlacement: 'string',
        adSdkName: 'string',
        duration: 'number',
        failReason: 'string'
      }
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'ad_failed',
    category: 'monetization',
    description: 'Ad failed to load or play',
    whenItHappens: 'Ad error',
    whyItMatters: 'Identifies ad delivery issues',
    eventData: {
      category: 'string',
      adEventData: {
        adType: 'string',
        adPlacement: 'string',
        adSdkName: 'string',
        duration: 'number',
        failReason: 'string'
      }
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'ad_clicked',
    category: 'monetization',
    description: 'Player taps on the ad',
    whenItHappens: 'Ad click',
    whyItMatters: 'Tracks ad engagement and revenue',
    eventData: {
      category: 'string',
      adEventData: {
        adType: 'string',
        adPlacement: 'string',
        adSdkName: 'string',
        duration: 'number',
        failReason: 'string'
      }
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },

  // C. Economy Events
  {
    eventName: 'currency_earned',
    category: 'economy',
    description: 'When the player gains coins/gems/etc.',
    whenItHappens: 'Currency gain',
    whyItMatters: 'Tracks virtual economy sources',
    eventData: {
      category: 'string',
      economyEventData: {
        currencyType: 'string',
        amount: 'number',
        reason: 'string'
      }
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'currency_spent',
    category: 'economy',
    description: 'When the player spends coins/gems/etc.',
    whenItHappens: 'Currency spend',
    whyItMatters: 'Tracks virtual economy sinks',
    eventData: {
      category: 'string',
      economyEventData: {
        currencyType: 'string',
        amount: 'number',
        reason: 'string'
      }
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },

  // D. Error & Technical Events
  {
    eventName: 'error_logged',
    category: 'technical',
    description: 'When a game error is detected',
    whenItHappens: 'Error occurrence',
    whyItMatters: 'Tracks bugs and crashes',
    eventData: {
      category: 'string',
      errorAndTechnicalEventData: {
        severity: 'string',
        message: 'string',
        stackTrace: 'string'
      }
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'fps_report',
    category: 'technical',
    description: 'Report frames per second (smoothness)',
    whenItHappens: 'Performance monitoring',
    whyItMatters: 'Tracks game performance',
    eventData: {
      category: 'string',
      errorAndTechnicalEventData: {
        fps: 'number'
      }
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'memory_usage',
    category: 'technical',
    description: 'Helps track memory issues',
    whenItHappens: 'Performance monitoring',
    whyItMatters: 'Identifies memory leaks',
    eventData: {
      category: 'string',
      errorAndTechnicalEventData: {
        memoryUsage: 'number'
      }
    },
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  }
];

// ==================== GAME ANALYTICS SDK EVENTS ====================

export const GAME_ANALYTICS_EVENTS: SDKEvent[] = [
  {
    eventName: 'ad_event',
    category: 'monetization',
    description: 'Track ad interactions',
    whenItHappens: 'Ad interactions',
    whyItMatters: 'Monitor ad performance',
    eventData: {
      category: 'Ad',
      adSdkName: 'string',
      adPlacement: 'string',
      adType: 'string',
      adAction: 'string',
      adFailShowReason: 'string',
      adDuration: 'number',
      adFirst: 'boolean'
    },
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'business_event',
    category: 'monetization',
    description: 'Track real money transactions',
    whenItHappens: 'IAP transactions',
    whyItMatters: 'Track revenue',
    eventData: {
      cartType: 'string',
      itemType: 'string',
      itemId: 'string',
      amount: 'number',
      currency: 'string',
      receipt: 'object'
    },
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'design_event',
    category: 'engagement',
    description: 'Track custom game concepts',
    whenItHappens: 'Custom events',
    whyItMatters: 'Track custom gameplay elements',
    eventData: {
      eventId: 'string',
      value: 'any'
    },
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'error_event',
    category: 'technical',
    description: 'Log errors or warnings',
    whenItHappens: 'Error occurrence',
    whyItMatters: 'Debug issues',
    eventData: {
      severity: 'string',
      message: 'string'
    },
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'impression_event',
    category: 'monetization',
    description: 'Track ad impressions',
    whenItHappens: 'Ad display',
    whyItMatters: 'Track ad revenue',
    eventData: {
      category: 'Impression',
      adNetworkName: 'string',
      impressionData: 'object'
    },
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'progression_event',
    category: 'engagement',
    description: 'Track level progression',
    whenItHappens: 'Level events',
    whyItMatters: 'Track player progress',
    eventData: {
      progressionStatus: 'string',
      progression_01: 'string',
      progression_02: 'string',
      progression_03: 'string',
      value: 'number'
    },
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'resource_event',
    category: 'economy',
    description: 'Track virtual currency',
    whenItHappens: 'Currency changes',
    whyItMatters: 'Balance virtual economy',
    eventData: {
      flowType: 'string',
      itemType: 'string',
      itemId: 'string',
      amount: 'number',
      resourceCurrency: 'string'
    },
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'performance_event',
    category: 'technical',
    description: 'Track system performance',
    whenItHappens: 'Performance monitoring',
    whyItMatters: 'Optimize performance',
    eventData: {
      cpuModel: 'string',
      hardware: 'string',
      cpuNumCores: 'number',
      resolution: 'string',
      memorySysTotal: 'number',
      memorySysUsed: 'number',
      memoryAppUsed: 'number',
      fpsDataTable: 'object'
    },
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'sdk_init',
    category: 'technical',
    description: 'Track app boot time',
    whenItHappens: 'SDK initialization',
    whyItMatters: 'Monitor app startup',
    eventData: {},
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'session_start',
    category: 'engagement',
    description: 'Track session start',
    whenItHappens: 'App boot',
    whyItMatters: 'Track engagement',
    eventData: {},
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    eventName: 'session_end',
    category: 'engagement',
    description: 'Track session end',
    whenItHappens: 'App close/background',
    whyItMatters: 'Calculate session length',
    eventData: {},
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  }
];

// ==================== SDK METRICS ====================

export const SDK_METRICS: SDKMetric[] = [
  // Hyper Rabbit Metrics
  {
    id: 'hr_cpi',
    name: 'CPI (Cost Per Install)',
    description: 'Ad Spend divided by Installs',
    formula: 'CPI = Ad Spend / Installs',
    eventSource: 'Calculated by number of users',
    category: 'monetization',
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'hr_retention',
    name: 'Retention',
    description: 'Returning Users divided by Installs Day 0',
    formula: 'Retention = Returning Users / Installs Day 0',
    eventSource: 'session_start event and user createdAt',
    category: 'retention',
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'hr_revenue',
    name: 'Revenue',
    description: 'IAP Revenue plus Ad Revenue',
    formula: 'Revenue = IAP Revenue + Ad Revenue',
    eventSource: 'iap_successful event',
    category: 'monetization',
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'hr_crashes',
    name: 'Crash Rate',
    description: 'Crashes divided by Sessions times 100',
    formula: 'Crashes = (Crashes / Sessions) * 100',
    eventSource: 'error_logged and session_start events',
    category: 'technical',
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'hr_roas_dx',
    name: 'ROAS Dx',
    description: 'Return on Ad Spend for X days',
    formula: 'ROAS Dx = (X days Revenue / Spend of Installs) * 100',
    eventSource: 'iap_successful event',
    category: 'monetization',
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'hr_gross_revenue',
    name: 'Gross Revenue',
    description: 'Sum of IAP and Ads Revenue',
    formula: 'Gross Revenue = ∑ (IAP Revenue + Ads Revenue)',
    eventSource: 'iap_successful event',
    category: 'monetization',
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'hr_dau',
    name: 'DAU (Daily Active Users)',
    description: 'Unique users per day',
    formula: 'COUNT(DISTINCT user_id) on a given day',
    eventSource: 'session_start event',
    category: 'engagement',
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'hr_mau',
    name: 'MAU (Monthly Active Users)',
    description: 'Unique users over 30 days',
    formula: 'Unique users over 30 days',
    eventSource: 'session_start event',
    category: 'engagement',
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'hr_session_length',
    name: 'Session Length',
    description: 'Session duration',
    formula: 'session_end - session_start',
    eventSource: 'session_start and session_end events',
    category: 'engagement',
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'hr_level_attempts',
    name: 'Level Attempts',
    description: 'Total level starts',
    formula: 'level_start count',
    eventSource: 'level_start event',
    category: 'engagement',
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'hr_win_rate',
    name: 'Win Rate',
    description: 'Level completion percentage',
    formula: 'level_complete / (level_complete + level_fail)',
    eventSource: 'level_complete and level_fail events',
    category: 'engagement',
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'hr_new_users',
    name: 'New Users',
    description: 'New users per day',
    formula: 'New users count per day',
    eventSource: 'User registration',
    category: 'engagement',
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'hr_app_boot_time',
    name: 'App Boot Time',
    description: 'SDK initialization time',
    formula: 'Time taken for SDK initialization',
    eventSource: 'SDK init event',
    category: 'technical',
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'hr_users_affected_by_errors',
    name: 'Users Affected by Errors',
    description: 'Count of users with error events',
    formula: 'Total users affected count by error event',
    eventSource: 'error_logged event',
    category: 'technical',
    sdkTypes: ['hyper_rabbit'],
    platforms: ['iOS', 'Android']
  },

  // Game Analytics Metrics
  {
    id: 'ga_arpdau',
    name: 'ARPDAU',
    description: 'Average revenue per daily active user',
    formula: 'Revenue / DAU',
    eventSource: 'business_event and session_start',
    category: 'monetization',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_arppu',
    name: 'ARPPU',
    description: 'Average revenue per paying user',
    formula: 'Revenue / Paying Users',
    eventSource: 'business_event',
    category: 'monetization',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_attempts',
    name: 'Attempts',
    description: 'Level attempts count',
    formula: 'Count of progression_event',
    eventSource: 'progression_event',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_avg_session_length',
    name: 'Average Session Length',
    description: 'Average seconds per session',
    formula: 'SUM(session_length) / session_count',
    eventSource: 'session_start and session_end',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_complete_score',
    name: 'Complete Score',
    description: 'Score on level completion',
    formula: 'Score from progression_event',
    eventSource: 'progression_event (Complete)',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_completes',
    name: 'Completes',
    description: 'Level completion count',
    formula: 'Count of progression_event (Complete)',
    eventSource: 'progression_event (Complete)',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_dau',
    name: 'DAU',
    description: 'Daily Active Users',
    formula: 'DISTINCT user_id per day',
    eventSource: 'session_start',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_dau_new_vs_returning',
    name: 'DAU (New vs. Returning)',
    description: 'Percentage of new users',
    formula: 'New Users / DAU',
    eventSource: 'session_start and user data',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_error_count',
    name: 'Error Count',
    description: 'Count of error events',
    formula: 'Count of error_event',
    eventSource: 'error_event',
    category: 'technical',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_fail_score',
    name: 'Fail Score',
    description: 'Score on level failure',
    formula: 'Score from progression_event',
    eventSource: 'progression_event (Fail)',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_fails',
    name: 'Fails',
    description: 'Level failure count',
    formula: 'Count of progression_event (Fail)',
    eventSource: 'progression_event (Fail)',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_conversion_rate',
    name: 'Conversion Rate',
    description: 'First-time purchasers percentage',
    formula: 'First-time Purchasers / DAU',
    eventSource: 'business_event',
    category: 'monetization',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_converting_users',
    name: 'Converting Users',
    description: 'First-time purchasers count',
    formula: 'Count of first business_event per user',
    eventSource: 'business_event',
    category: 'monetization',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_flow',
    name: 'Flow',
    description: 'Currency balance (earned - spent)',
    formula: 'SUM(earned) - SUM(spent)',
    eventSource: 'resource_event',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_starts',
    name: 'Starts',
    description: 'Level start count',
    formula: 'Count of progression_event (Start)',
    eventSource: 'progression_event (Start)',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_mau',
    name: 'MAU',
    description: 'Monthly Active Users',
    formula: 'DISTINCT user_id over 30 days',
    eventSource: 'session_start',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_new_users',
    name: 'New Users',
    description: 'New users per day',
    formula: 'Count of new users',
    eventSource: 'session_start (first time)',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_num_sessions',
    name: 'Number of Sessions',
    description: 'Session count',
    formula: 'Count of session_start',
    eventSource: 'session_start',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_paying_users',
    name: 'Paying Users',
    description: 'Users who made purchases',
    formula: 'DISTINCT user_id with business_event',
    eventSource: 'business_event',
    category: 'monetization',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_sink',
    name: 'Sink',
    description: 'Currency spent/lost',
    formula: 'SUM(resource_event where flowType=Loss)',
    eventSource: 'resource_event (Loss)',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_source',
    name: 'Source',
    description: 'Currency gained/earned',
    formula: 'SUM(resource_event where flowType=Gain)',
    eventSource: 'resource_event (Gain)',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_retention',
    name: 'Retention',
    description: 'User retention percentage',
    formula: 'Returning Users / Installed Users',
    eventSource: 'session_start',
    category: 'retention',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_returning_users',
    name: 'Returning Users',
    description: 'Users who returned after X days',
    formula: 'Count of returning sessions',
    eventSource: 'session_start',
    category: 'retention',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_revenue',
    name: 'Revenue',
    description: 'Total transaction revenue',
    formula: 'SUM(business_event.amount)',
    eventSource: 'business_event',
    category: 'monetization',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_revenue_per_transaction',
    name: 'Revenue per Transaction',
    description: 'Average transaction value',
    formula: 'SUM(amount) / COUNT(business_event)',
    eventSource: 'business_event',
    category: 'monetization',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_session_length',
    name: 'Session Length',
    description: 'Time from start to background',
    formula: 'session_end - session_start',
    eventSource: 'session_start and session_end',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_playtime_per_session',
    name: 'Playtime per Session',
    description: 'Average session playtime',
    formula: 'AVG(session_length)',
    eventSource: 'session_start and session_end',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_playtime_per_user',
    name: 'Playtime per User',
    description: 'Average user playtime',
    formula: 'SUM(session_length) / DISTINCT(user_id)',
    eventSource: 'session_start and session_end',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_transactions',
    name: 'Transactions',
    description: 'Transaction count',
    formula: 'COUNT(business_event)',
    eventSource: 'business_event',
    category: 'monetization',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_users_affected_by_errors',
    name: 'Users Affected by Errors',
    description: 'Users with error events',
    formula: 'DISTINCT user_id with error_event',
    eventSource: 'error_event',
    category: 'technical',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_wau',
    name: 'WAU',
    description: 'Weekly Active Users',
    formula: 'DISTINCT user_id over 7 days',
    eventSource: 'session_start',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  },
  {
    id: 'ga_win_percentage',
    name: 'Win Percentage',
    description: 'Level completion percentage',
    formula: 'Completes / (Completes + Fails)',
    eventSource: 'progression_event',
    category: 'engagement',
    sdkTypes: ['game_analytics'],
    platforms: ['iOS', 'Android']
  }
];

// ==================== SDK REPORT CONFIGURATIONS ====================

export const SDK_REPORT_CONFIGS: SDKReportConfig[] = [
  // Hyper Rabbit - Android
  {
    id: 'hr_android_engagement',
    name: 'Hyper Rabbit - Engagement Metrics (Android)',
    description: 'User engagement metrics for Android using Hyper Rabbit SDK',
    sdkType: 'hyper_rabbit',
    platforms: ['Android'],
    category: 'developer',
    metrics: ['hr_dau', 'hr_mau', 'hr_session_length', 'hr_level_attempts', 'hr_win_rate', 'hr_new_users'],
    events: ['session_start', 'session_end', 'level_start', 'level_complete', 'level_fail', 'gameplay_start', 'gameplay_stop'],
    chartType: 'combo',
    enabled: true,
    refreshInterval: 60,
    dataRetention: 365
  },
  {
    id: 'hr_android_monetization',
    name: 'Hyper Rabbit - Monetization (Android)',
    description: 'Monetization metrics for Android using Hyper Rabbit SDK',
    sdkType: 'hyper_rabbit',
    platforms: ['Android'],
    category: 'developer',
    metrics: ['hr_revenue', 'hr_gross_revenue', 'hr_cpi', 'hr_roas_dx'],
    events: ['iap_initiated', 'iap_successful', 'iap_failed', 'iap_consumed', 'ad_started', 'ad_completed', 'ad_skipped', 'ad_failed', 'ad_clicked'],
    chartType: 'combo',
    enabled: true,
    refreshInterval: 60,
    dataRetention: 365
  },
  {
    id: 'hr_android_retention',
    name: 'Hyper Rabbit - Retention (Android)',
    description: 'Retention metrics for Android using Hyper Rabbit SDK',
    sdkType: 'hyper_rabbit',
    platforms: ['Android'],
    category: 'developer',
    metrics: ['hr_retention', 'hr_dau', 'hr_new_users'],
    events: ['session_start', 'session_end'],
    chartType: 'line',
    enabled: true,
    refreshInterval: 120,
    dataRetention: 365
  },
  {
    id: 'hr_android_performance',
    name: 'Hyper Rabbit - Performance (Android)',
    description: 'Technical performance metrics for Android using Hyper Rabbit SDK',
    sdkType: 'hyper_rabbit',
    platforms: ['Android'],
    category: 'developer',
    metrics: ['hr_crashes', 'hr_app_boot_time', 'hr_users_affected_by_errors'],
    events: ['error_logged', 'fps_report', 'memory_usage'],
    chartType: 'line',
    enabled: true,
    refreshInterval: 30,
    dataRetention: 90
  },
  {
    id: 'hr_android_economy',
    name: 'Hyper Rabbit - Virtual Economy (Android)',
    description: 'Virtual economy tracking for Android using Hyper Rabbit SDK',
    sdkType: 'hyper_rabbit',
    platforms: ['Android'],
    category: 'developer',
    metrics: ['hr_revenue'],
    events: ['currency_earned', 'currency_spent'],
    chartType: 'bar',
    enabled: true,
    refreshInterval: 60,
    dataRetention: 365
  },

  // Hyper Rabbit - iOS
  {
    id: 'hr_ios_engagement',
    name: 'Hyper Rabbit - Engagement Metrics (iOS)',
    description: 'User engagement metrics for iOS using Hyper Rabbit SDK',
    sdkType: 'hyper_rabbit',
    platforms: ['iOS'],
    category: 'developer',
    metrics: ['hr_dau', 'hr_mau', 'hr_session_length', 'hr_level_attempts', 'hr_win_rate', 'hr_new_users'],
    events: ['session_start', 'session_end', 'level_start', 'level_complete', 'level_fail', 'gameplay_start', 'gameplay_stop'],
    chartType: 'combo',
    enabled: true,
    refreshInterval: 60,
    dataRetention: 365
  },
  {
    id: 'hr_ios_monetization',
    name: 'Hyper Rabbit - Monetization (iOS)',
    description: 'Monetization metrics for iOS using Hyper Rabbit SDK',
    sdkType: 'hyper_rabbit',
    platforms: ['iOS'],
    category: 'developer',
    metrics: ['hr_revenue', 'hr_gross_revenue', 'hr_cpi', 'hr_roas_dx'],
    events: ['iap_initiated', 'iap_successful', 'iap_failed', 'iap_consumed', 'ad_started', 'ad_completed', 'ad_skipped', 'ad_failed', 'ad_clicked'],
    chartType: 'combo',
    enabled: true,
    refreshInterval: 60,
    dataRetention: 365
  },
  {
    id: 'hr_ios_retention',
    name: 'Hyper Rabbit - Retention (iOS)',
    description: 'Retention metrics for iOS using Hyper Rabbit SDK',
    sdkType: 'hyper_rabbit',
    platforms: ['iOS'],
    category: 'developer',
    metrics: ['hr_retention', 'hr_dau', 'hr_new_users'],
    events: ['session_start', 'session_end'],
    chartType: 'line',
    enabled: true,
    refreshInterval: 120,
    dataRetention: 365
  },
  {
    id: 'hr_ios_performance',
    name: 'Hyper Rabbit - Performance (iOS)',
    description: 'Technical performance metrics for iOS using Hyper Rabbit SDK',
    sdkType: 'hyper_rabbit',
    platforms: ['iOS'],
    category: 'developer',
    metrics: ['hr_crashes', 'hr_app_boot_time', 'hr_users_affected_by_errors'],
    events: ['error_logged', 'fps_report', 'memory_usage'],
    chartType: 'line',
    enabled: true,
    refreshInterval: 30,
    dataRetention: 90
  },
  {
    id: 'hr_ios_economy',
    name: 'Hyper Rabbit - Virtual Economy (iOS)',
    description: 'Virtual economy tracking for iOS using Hyper Rabbit SDK',
    sdkType: 'hyper_rabbit',
    platforms: ['iOS'],
    category: 'developer',
    metrics: ['hr_revenue'],
    events: ['currency_earned', 'currency_spent'],
    chartType: 'bar',
    enabled: true,
    refreshInterval: 60,
    dataRetention: 365
  },

  // Game Analytics - Android
  {
    id: 'ga_android_engagement',
    name: 'Game Analytics - Engagement Metrics (Android)',
    description: 'User engagement metrics for Android using Game Analytics SDK',
    sdkType: 'game_analytics',
    platforms: ['Android'],
    category: 'developer',
    metrics: ['ga_dau', 'ga_mau', 'ga_wau', 'ga_avg_session_length', 'ga_playtime_per_session', 'ga_playtime_per_user', 'ga_new_users', 'ga_num_sessions'],
    events: ['session_start', 'session_end', 'design_event'],
    chartType: 'combo',
    enabled: true,
    refreshInterval: 60,
    dataRetention: 365
  },
  {
    id: 'ga_android_monetization',
    name: 'Game Analytics - Monetization (Android)',
    description: 'Monetization metrics for Android using Game Analytics SDK',
    sdkType: 'game_analytics',
    platforms: ['Android'],
    category: 'developer',
    metrics: ['ga_revenue', 'ga_arpdau', 'ga_arppu', 'ga_conversion_rate', 'ga_converting_users', 'ga_paying_users', 'ga_transactions', 'ga_revenue_per_transaction'],
    events: ['business_event', 'ad_event', 'impression_event'],
    chartType: 'combo',
    enabled: true,
    refreshInterval: 60,
    dataRetention: 365
  },
  {
    id: 'ga_android_progression',
    name: 'Game Analytics - Progression (Android)',
    description: 'Level progression metrics for Android using Game Analytics SDK',
    sdkType: 'game_analytics',
    platforms: ['Android'],
    category: 'developer',
    metrics: ['ga_starts', 'ga_completes', 'ga_fails', 'ga_attempts', 'ga_win_percentage', 'ga_complete_score', 'ga_fail_score'],
    events: ['progression_event'],
    chartType: 'bar',
    enabled: true,
    refreshInterval: 60,
    dataRetention: 365
  },
  {
    id: 'ga_android_retention',
    name: 'Game Analytics - Retention (Android)',
    description: 'Retention metrics for Android using Game Analytics SDK',
    sdkType: 'game_analytics',
    platforms: ['Android'],
    category: 'developer',
    metrics: ['ga_retention', 'ga_returning_users', 'ga_dau_new_vs_returning'],
    events: ['session_start', 'session_end'],
    chartType: 'line',
    enabled: true,
    refreshInterval: 120,
    dataRetention: 365
  },
  {
    id: 'ga_android_economy',
    name: 'Game Analytics - Virtual Economy (Android)',
    description: 'Virtual economy metrics for Android using Game Analytics SDK',
    sdkType: 'game_analytics',
    platforms: ['Android'],
    category: 'developer',
    metrics: ['ga_flow', 'ga_sink', 'ga_source'],
    events: ['resource_event'],
    chartType: 'bar',
    enabled: true,
    refreshInterval: 60,
    dataRetention: 365
  },
  {
    id: 'ga_android_performance',
    name: 'Game Analytics - Performance (Android)',
    description: 'Technical performance metrics for Android using Game Analytics SDK',
    sdkType: 'game_analytics',
    platforms: ['Android'],
    category: 'developer',
    metrics: ['ga_error_count', 'ga_users_affected_by_errors'],
    events: ['error_event', 'performance_event', 'sdk_init'],
    chartType: 'line',
    enabled: true,
    refreshInterval: 30,
    dataRetention: 90
  },

  // Game Analytics - iOS
  {
    id: 'ga_ios_engagement',
    name: 'Game Analytics - Engagement Metrics (iOS)',
    description: 'User engagement metrics for iOS using Game Analytics SDK',
    sdkType: 'game_analytics',
    platforms: ['iOS'],
    category: 'developer',
    metrics: ['ga_dau', 'ga_mau', 'ga_wau', 'ga_avg_session_length', 'ga_playtime_per_session', 'ga_playtime_per_user', 'ga_new_users', 'ga_num_sessions'],
    events: ['session_start', 'session_end', 'design_event'],
    chartType: 'combo',
    enabled: true,
    refreshInterval: 60,
    dataRetention: 365
  },
  {
    id: 'ga_ios_monetization',
    name: 'Game Analytics - Monetization (iOS)',
    description: 'Monetization metrics for iOS using Game Analytics SDK',
    sdkType: 'game_analytics',
    platforms: ['iOS'],
    category: 'developer',
    metrics: ['ga_revenue', 'ga_arpdau', 'ga_arppu', 'ga_conversion_rate', 'ga_converting_users', 'ga_paying_users', 'ga_transactions', 'ga_revenue_per_transaction'],
    events: ['business_event', 'ad_event', 'impression_event'],
    chartType: 'combo',
    enabled: true,
    refreshInterval: 60,
    dataRetention: 365
  },
  {
    id: 'ga_ios_progression',
    name: 'Game Analytics - Progression (iOS)',
    description: 'Level progression metrics for iOS using Game Analytics SDK',
    sdkType: 'game_analytics',
    platforms: ['iOS'],
    category: 'developer',
    metrics: ['ga_starts', 'ga_completes', 'ga_fails', 'ga_attempts', 'ga_win_percentage', 'ga_complete_score', 'ga_fail_score'],
    events: ['progression_event'],
    chartType: 'bar',
    enabled: true,
    refreshInterval: 60,
    dataRetention: 365
  },
  {
    id: 'ga_ios_retention',
    name: 'Game Analytics - Retention (iOS)',
    description: 'Retention metrics for iOS using Game Analytics SDK',
    sdkType: 'game_analytics',
    platforms: ['iOS'],
    category: 'developer',
    metrics: ['ga_retention', 'ga_returning_users', 'ga_dau_new_vs_returning'],
    events: ['session_start', 'session_end'],
    chartType: 'line',
    enabled: true,
    refreshInterval: 120,
    dataRetention: 365
  },
  {
    id: 'ga_ios_economy',
    name: 'Game Analytics - Virtual Economy (iOS)',
    description: 'Virtual economy metrics for iOS using Game Analytics SDK',
    sdkType: 'game_analytics',
    platforms: ['iOS'],
    category: 'developer',
    metrics: ['ga_flow', 'ga_sink', 'ga_source'],
    events: ['resource_event'],
    chartType: 'bar',
    enabled: true,
    refreshInterval: 60,
    dataRetention: 365
  },
  {
    id: 'ga_ios_performance',
    name: 'Game Analytics - Performance (iOS)',
    description: 'Technical performance metrics for iOS using Game Analytics SDK',
    sdkType: 'game_analytics',
    platforms: ['iOS'],
    category: 'developer',
    metrics: ['ga_error_count', 'ga_users_affected_by_errors'],
    events: ['error_event', 'performance_event', 'sdk_init'],
    chartType: 'line',
    enabled: true,
    refreshInterval: 30,
    dataRetention: 90
  }
];

// Utility functions for SDK reports
export const getSDKReports = (sdkType: SDKType, platform: PlatformType): SDKReportConfig[] => {
  return SDK_REPORT_CONFIGS.filter(
    config => config.sdkType === sdkType && config.platforms.includes(platform)
  );
};

export const getSDKMetrics = (sdkType: SDKType, platform: PlatformType): SDKMetric[] => {
  return SDK_METRICS.filter(
    metric => metric.sdkTypes.includes(sdkType) && metric.platforms.includes(platform)
  );
};

export const getSDKEvents = (sdkType: SDKType, platform: PlatformType): SDKEvent[] => {
  const events = sdkType === 'hyper_rabbit' ? HYPER_RABBIT_EVENTS : GAME_ANALYTICS_EVENTS;
  return events.filter(event => event.platforms.includes(platform));
};

export const getAllSDKTypes = (): SDKType[] => ['hyper_rabbit', 'game_analytics'];

export const getSDKName = (sdkType: SDKType): string => {
  const names: Record<SDKType, string> = {
    hyper_rabbit: 'Hyper Rabbit',
    game_analytics: 'Game Analytics'
  };
  return names[sdkType];
};






