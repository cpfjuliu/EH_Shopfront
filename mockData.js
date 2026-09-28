export const dataProducts = {
  attendance: {
    id: 'attendance',
    name: 'Student Attendance',
    type: 'Standard data product',
    lifecycle: 'Certified',
    version: 'v2.3',
    owner: 'Student Data Domain',
    steward: 'Attendance Data Steward',
    freshness: 'Daily by 6 PM',
    updated: 'Today, 5:58 PM',
    lastValidated: 'Today, 6:03 PM',
    trust: 'Healthy',
    classification: 'Sensitive',
    coverage: 'All schools',
    quality: '99.4% checks passed',
    authoritative: 'Yes',
    description: 'Daily student attendance, absence category and latecoming records standardised for reusable analysis and downstream consumption.',
    source: 'School Cockpit → Edu Hub',
    definition: 'Attendance status follows the approved Edu Hub attendance business rules for this prototype.',
    allowedUse: 'Authorised MOE analysis, dashboards and registered system consumers.',
    fields: [
      ['student_id', 'STRING', 'Internal student identifier', 'Sensitive', 'Not null'],
      ['attendance_date', 'DATE', 'School day', 'Internal', 'Not null'],
      ['attendance_status', 'STRING', 'Present, absent or partial', 'Sensitive', 'Accepted values'],
      ['absence_category', 'STRING', 'Approved absence classification', 'Sensitive', 'Reference list'],
      ['latecoming_flag', 'BOOLEAN', 'Whether the student was late', 'Sensitive', 'Boolean'],
      ['freshness_timestamp', 'TIMESTAMP', 'Latest source update included', 'Internal', 'Not null'],
    ],
    deliveries: [
      ['REST API', '/v2/student-attendance', 'Near-real-time read', 'Registered applications', '99.5% monthly'],
      ['Direct query', 'edu_hub.student_attendance_v2', 'Daily by 6 PM', 'Approved analytics workspaces', '99.5% monthly'],
      ['Managed file', 'S3 / secure transfer', 'Daily 6:15 PM', 'Approved batch consumers', '99.0% monthly'],
    ],
    versions: [
      ['v2.3', 'Current', '15 Sep 2026', 'Added freshness_timestamp; backward compatible', '31 Mar 2027'],
      ['v2.2', 'Supported', '10 Jun 2026', 'Standardised absence categories', '31 Dec 2026'],
      ['v2.1', 'Deprecated', '18 Feb 2026', 'Legacy latecoming values', '31 Oct 2026'],
    ],
    consumers: [
      ['KM2', 'REST API', 'v2.3', 'Production', 'Today 5:59 PM'],
      ['MOEinfo', 'Direct query', 'v2.2', 'Production', 'Today 6:01 PM'],
      ['Student Support App', 'REST API', 'v2.3', 'Production', 'Today 5:57 PM'],
      ['HQ Analytics', 'Direct query', 'v2.3', 'Analytics', 'Today 6:02 PM'],
    ],
    lineage: [
      ['School Cockpit', 'Source', 'Student attendance records', 'Healthy'],
      ['Attendance standardisation', 'Transform', 'Status mapping, school-day checks, deduplication', 'Healthy'],
      ['Student Attendance v2.3', 'Product', 'Certified reusable contract', 'Healthy'],
      ['Downstream consumers', 'Consumption', 'APIs, query and managed files', 'Monitored'],
    ],
    qualityChecks: [
      ['Freshness', 'Data available by 6 PM', '5:58 PM', 'Pass'],
      ['Completeness', 'Expected schools received', '98.9%', 'Warning'],
      ['Valid status values', 'Approved values only', '100%', 'Pass'],
      ['Duplicate student-day rows', '< 0.05%', '0.01%', 'Pass'],
      ['Referential integrity', 'Student ID resolves to active identity', '99.8%', 'Pass'],
    ],
    permissions: [
      ['HQ Analyst', 'Query approved fields', 'Purpose + workspace entitlement', 'Allowed'],
      ['Business Officer', 'Aggregated dashboard views', 'Authorised scope', 'Allowed'],
      ['Registered system', 'Contracted fields only', 'Workload identity + subscription', 'Allowed'],
      ['External partner', 'No direct raw access', 'Purpose-specific controlled workspace', 'Restricted'],
    ],
    sampleRows: [
      ['STU-•••812', '2026-09-25', 'ABSENT', 'MC', 'false'],
      ['STU-•••044', '2026-09-25', 'PRESENT', '—', 'true'],
      ['STU-•••391', '2026-09-25', 'PARTIAL', 'Approved absence', 'false'],
    ],
  },
  identity: {
    id: 'identity',
    name: 'Student Identity',
    type: 'Standard data product',
    lifecycle: 'Certified',
    version: 'v1.8',
    owner: 'Student Data Domain',
    steward: 'Student Master Data Steward',
    freshness: 'Daily',
    updated: 'Today, 5:52 PM',
    lastValidated: 'Today, 5:56 PM',
    trust: 'Healthy',
    classification: 'Sensitive',
    coverage: 'All active students',
    quality: '99.8% checks passed',
    authoritative: 'Yes',
    description: 'Core student identifiers, school, class, level and enrolment context.',
    source: 'Student Management System → Edu Hub',
    definition: 'Authoritative student identity and enrolment context for approved Edu Hub use cases.',
    allowedUse: 'Authorised MOE analysis and registered system consumers.',
    fields: [
      ['student_id', 'STRING', 'Internal student identifier', 'Sensitive', 'Not null'],
      ['school_code', 'STRING', 'School identifier', 'Internal', 'Reference list'],
      ['class_code', 'STRING', 'Class identifier', 'Sensitive', 'Reference list'],
      ['level', 'STRING', 'Education level', 'Internal', 'Accepted values'],
      ['enrolment_status', 'STRING', 'Current enrolment status', 'Sensitive', 'Accepted values'],
    ],
    deliveries: [
      ['REST API', '/v1/student-identity', 'Daily refresh', 'Registered applications', '99.7% monthly'],
      ['Direct query', 'edu_hub.student_identity_v1', 'Daily', 'Approved analytics workspaces', '99.7% monthly'],
    ],
    versions: [
      ['v1.8', 'Current', '20 Aug 2026', 'Added enrolment effective dates', '30 Jun 2027'],
      ['v1.7', 'Supported', '12 Apr 2026', 'Standardised class identifiers', '31 Jan 2027'],
    ],
    consumers: [
      ['KM2', 'REST API', 'v1.8', 'Production', 'Today 5:55 PM'],
      ['Student Support App', 'REST API', 'v1.8', 'Production', 'Today 5:54 PM'],
      ['HQ Analytics', 'Direct query', 'v1.8', 'Analytics', 'Today 5:57 PM'],
    ],
    lineage: [
      ['Student Management System', 'Source', 'Student master records', 'Healthy'],
      ['Identity standardisation', 'Transform', 'Keys, enrolment status and reference mapping', 'Healthy'],
      ['Student Identity v1.8', 'Product', 'Certified reusable contract', 'Healthy'],
    ],
    qualityChecks: [
      ['Freshness', 'Daily load complete', '5:52 PM', 'Pass'],
      ['Unique student_id', '100%', '100%', 'Pass'],
      ['School reference integrity', '> 99.9%', '100%', 'Pass'],
    ],
    permissions: [
      ['HQ Analyst', 'Approved fields', 'Purpose + workspace entitlement', 'Allowed'],
      ['Registered system', 'Contracted fields', 'Workload identity + subscription', 'Allowed'],
      ['External partner', 'Pseudonymous subset only', 'Approved project', 'Restricted'],
    ],
    sampleRows: [
      ['STU-•••812', 'SCH-014', '1A', 'Secondary 1', 'Active'],
      ['STU-•••044', 'SCH-022', '2B', 'Secondary 2', 'Active'],
    ],
  },
  calendar: {
    id: 'calendar',
    name: 'School Calendar',
    type: 'Reference dataset',
    lifecycle: 'Verified',
    version: '2026.3',
    owner: 'School Operations',
    steward: 'Operations Data Steward',
    freshness: 'Termly',
    updated: '2 Sep 2026',
    lastValidated: '2 Sep 2026',
    trust: 'Healthy',
    classification: 'Internal',
    coverage: 'All schools',
    quality: 'Validated',
    authoritative: 'Yes',
    description: 'School terms, holidays and instructional days.',
    source: 'School Operations',
    definition: 'MOE school calendar reference for analysis and standardisation.',
    allowedUse: 'Internal MOE analysis and application logic.',
    fields: [
      ['calendar_date', 'DATE', 'Calendar date', 'Internal', 'Not null'],
      ['is_school_day', 'BOOLEAN', 'Whether the date is an instructional day', 'Internal', 'Boolean'],
      ['term', 'STRING', 'School term', 'Internal', 'Accepted values'],
    ],
    deliveries: [['Direct query', 'edu_hub.school_calendar', 'Termly', 'MOE consumers', 'Reference']],
    versions: [['2026.3', 'Current', '2 Sep 2026', 'Term 4 updates', '31 Dec 2026']],
    consumers: [['Student Attendance', 'Reference join', '2026.3', 'Production', 'Today']],
    lineage: [['School Operations', 'Source', 'Published calendar', 'Healthy'], ['School Calendar', 'Reference', 'Verified reference dataset', 'Healthy']],
    qualityChecks: [['Coverage', 'All instructional dates represented', '100%', 'Pass']],
    permissions: [['MOE users', 'Read', 'Authenticated', 'Allowed']],
    sampleRows: [['2026-09-28', 'true', 'Term 4'], ['2026-10-02', 'false', 'Term 4']],
  },
}

export const metrics = {
  frequentAbsence: {
    name: 'Frequent absence rate',
    version: 'v3',
    owner: 'Student Data Domain',
    status: 'Governed',
    description: 'Percentage of students absent on 10% or more instructional days in the selected period. Prototype definition for demonstration only.',
    formula: 'Students absent on ≥10% of instructional days ÷ eligible students',
    grain: 'Student within selected period, then aggregated to authorised cohort',
  },
}

export const dashboards = {
  attendanceOverview: {
    name: 'Student Attendance Overview',
    description: 'School and cohort attendance trends for authorised users.',
    owner: 'Student Data Domain',
    updated: 'Today, 6:04 PM',
    definition: 'Attendance v3',
  },
  frequentAbsenceExplorer: {
    name: 'Students Missing School Frequently',
    description: 'Explore students missing school frequently using a governed, clearly defined measure.',
    owner: 'Student Data Domain',
    updated: 'Today, 6:04 PM',
    definition: 'Frequent absence rate v3',
  },
}

export const chartData = {
  cohort: [
    { label: 'Sec 1', value: 78 },
    { label: 'Sec 2', value: 63 },
    { label: 'Sec 3', value: 39 },
    { label: 'Sec 4', value: 31 },
  ],
  school: [
    { label: 'Cluster A', value: 80 },
    { label: 'Cluster B', value: 68 },
    { label: 'Cluster C', value: 49 },
    { label: 'Cluster D', value: 42 },
    { label: 'Cluster E', value: 27 },
  ],
  monthly: [
    { label: 'May', value: 38 },
    { label: 'Jun', value: 42 },
    { label: 'Jul', value: 49 },
    { label: 'Aug', value: 55 },
    { label: 'Sep', value: 61 },
  ],
}

export const userProfiles = {
  analyst: { name: 'Julius Chen', role: 'HQ Analyst', initials: 'JC', context: 'HQ Analytics' },
  business: { name: 'Julius Chen', role: 'Business Officer', initials: 'JC', context: 'MOE HQ' },
  system: { name: 'Julius Chen', role: 'Application Developer', initials: 'JC', context: 'Digital Products' },
  partner: { name: 'Alicia Tan', role: 'External Partner', initials: 'AT', context: 'Example Programme Partner' },
}

export const recentItems = {
  analyst: [
    ['Notebook', 'Frequent absence exploration', 'Updated yesterday'],
    ['Data product', 'Student Attendance', 'Healthy'],
    ['Dashboard', 'Attendance Overview', 'Daily'],
  ],
  business: [
    ['Dashboard', 'Student Attendance Overview', 'Updated today'],
    ['Briefing', 'Attendance monthly briefing', '2 days ago'],
    ['Explorer', 'Students Missing School Frequently', 'Updated today'],
  ],
  system: [
    ['Consumer', 'Student Support App', 'Production'],
    ['Contract', 'Student Attendance v2.3', 'Healthy'],
    ['Subscription', 'Student Identity', 'Active'],
  ],
  partner: [
    ['Project', 'Student Support Programme', 'Active'],
    ['Workspace', 'Programme evaluation', '164 days left'],
    ['Agreement', 'Data sharing agreement', 'Active'],
  ],
}

export const notifications = {
  analyst: [
    ['Data quality', '2 attendance source feeds are delayed', 'Latest values for two schools are provisional.', 'warning'],
    ['Access', 'Student Attendance access approved', 'HQ Analytics Workspace is ready.', 'success'],
    ['Change', 'Frequent absence rate v3 documentation updated', 'Calculation is unchanged; examples were clarified.', 'neutral'],
  ],
  business: [
    ['Briefing', 'Attendance monthly briefing is ready', 'Uses data validated at 6:03 PM today.', 'success'],
    ['Data quality', '2 school feeds delayed', 'Affected values are labelled provisional.', 'warning'],
    ['Change', 'Attendance Overview refreshed', '12 schools are above your saved monitoring threshold.', 'neutral'],
  ],
  system: [
    ['Version', 'Student Attendance v2.4 planned', 'Non-breaking preview available for contract testing.', 'neutral'],
    ['Consumer health', '47 / 47 contract tests passed', 'Student Support App remains compatible.', 'success'],
    ['Data quality', '2 source feeds delayed', 'API responses expose freshness status.', 'warning'],
  ],
  partner: [
    ['Review', 'Project access review due in 45 days', 'MOE sponsor confirmation required.', 'warning'],
    ['Workspace', 'Programme evaluation workspace healthy', '164 days remain before automatic expiry.', 'success'],
  ],
}

export const governanceBackstage = {
  metrics: [
    ['Certified SDPs', '18'],
    ['Consumers protected by contracts', '31'],
    ['Median request-to-use', '1.6 days'],
    ['Reusable consumption this month', '74%'],
  ],
  reviewQueue: [
    ['Student Attendance v2.4', 'Version review', 'Student Data Domain', 'Due 2 Oct', 'In review'],
    ['Student Results v1.0', 'Certification', 'Academic Data Domain', 'Due 5 Oct', 'Needs owner sign-off'],
    ['Partner project DSA-2041', 'Purpose renewal', 'Programme owner', 'Due 12 Nov', 'Pending'],
  ],
  incidents: [
    ['Attendance feed delay', '2 schools', 'Opened 5:42 PM', 'Consumers automatically marked provisional', 'Monitoring'],
    ['Reference mapping warning', '1 code', 'Opened yesterday', 'No consumer impact', 'Investigating'],
  ],
  changes: [
    ['Student Attendance v2.4', 'Preview', 'Add source_status field', '4 consumers tested, 0 breaking'],
    ['Student Identity v1.9', 'Draft', 'Clarify enrolment effective dates', '3 consumers to test'],
  ],
}
