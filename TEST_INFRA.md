# E2E Test Infra: Ministry of Shorthand UI Redesign

## Test Philosophy
- **Opaque-box, requirement-driven**: Tests do not import or access internal application code directly. They interact with the system purely as a user would, via the UI and standard APIs.
- **Methodology**: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial Testing + Real-World Workload Testing.
- **Test Runner**: Playwright (v1.40+) for multi-role session state caching (`storageState`), parallel execution, and built-in tracing.

## Feature Inventory
We identify 4 key user-facing features to be verified:
1. **F1: Public Navigation & Landing Page**: Landing page sections (Hero, Features, How It Works, Testimonials), custom layout classes, theme toggling, hover transitions, and mobile menu visibility.
2. **F2: Authentication & Onboarding**: Sign up, sign in (Credentials-based), sign out, and initial student onboarding form flow.
3. **F3: Practice Dashboard**: Card structures, navigation links (billing, profile, live classes, notifications), stats counters (average accuracy, tests taken, current streak), and progress progress-bars.
4. **F4: Dictation Practice & Resulting**: Playback controls (play, pause, speed), timer expiration, text area editor transcription, instant accuracy/WPM result calculation, and history logs.

| # | Feature | Source | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Cross-Feature) | Tier 4 (Workload) |
|---|---------|--------|:----------------:|:-----------------:|:----------------------:|:-----------------:|
| 1 | F1: Landing Page | ORIGINAL_REQUEST | 5 | 5 | ✓ | ✓ |
| 2 | F2: Auth & Onboarding | ORIGINAL_REQUEST | 5 | 5 | ✓ | ✓ |
| 3 | F3: Practice Dashboard | ORIGINAL_REQUEST | 5 | 5 | ✓ | ✓ |
| 4 | F4: Dictation Practice | ORIGINAL_REQUEST | 5 | 5 | ✓ | ✓ |

## Test Architecture
- **Location**: All test files are located under `/e2e`.
- **Test Runner Invocation**: `pnpm test:e2e`
- **Output Format**: Playwright HTML reports located under `/playwright-report` and console logs.
- **Folder Structure**:
  - `/e2e/auth.setup.ts`: Sets up cached session files under `playwright/.auth/`.
  - `/e2e/public/`: Guest/public tests (Tier 1 & Tier 2 for F1, F2 signup/login).
  - `/e2e/student/`: Authenticated student tests (Tier 1 & Tier 2 for F3, F4, onboarding).
  - `/e2e/admin/`: Admin user verification.
  - `/e2e/scenarios/`: Real-world workload, cross-feature combination, and integration tests (Tiers 3 & 4).

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Complete Student Journey | F2 (Signup/Onboarding) -> F3 (Dashboard) -> F4 (Complete Dictation Practice) | High |
| 2 | Authenticated Student Practice & History | F3 (Dashboard stats check) -> F4 (Take Dictation & Verify Results) -> F3 (Verify stats update) | High |
| 3 | Course Enrollment to Lesson Progress | F3 (Dashboard) -> F1 (Browse Courses) -> F3 (Enroll and check progress update) | Medium |
| 4 | Authentication Guarding & Redirection | F2 (Access dashboard as guest) -> Redirect to /login -> Login -> Redirect to Dashboard | Medium |
| 5 | Custom Dictation Settings & Execution | F4 (Config practice settings) -> F4 (Transcribe with timer expiry) -> Check results accuracy | High |

## Coverage Thresholds
- **Tier 1: Feature Coverage (Landing page, links/practices, states)**: ≥5 test cases per feature (Total ≥20).
- **Tier 2: Boundary & Corner Cases**: ≥5 test cases per feature (Total ≥20).
- **Tier 3: Cross-Feature Combinations (Pairwise)**: ≥4 test cases.
- **Tier 4: Real-World Application Scenarios**: ≥5 realistic application scenarios.
- **Total Minimum**: 49 E2E test cases.
