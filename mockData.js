export const dataProducts = {
  attendance: {
    id: 'attendance',
    name: 'Student Attendance',
    type: 'Standard data product',
    owner: 'Student Data Domain',
    freshness: 'Daily by 6 PM',
    updated: 'Today, 5:58 PM',
    trust: 'Healthy',
    classification: 'Sensitive',
    coverage: 'All schools',
    quality: '99.4% checks passed',
    description: 'Daily student attendance, absence category and latecoming records standardised for reusable analysis and downstream consumption.',
    source: 'School Cockpit → Edu Hub',
    definition: 'Attendance status follows MOE Attendance Definition v3.',
    fields: [
      ['student_id', 'STRING', 'Internal student identifier'],
      ['attendance_date', 'DATE', 'School day'],
      ['attendance_status', 'STRING', 'Present, absent or partial'],
      ['absence_category', 'STRING', 'Approved absence classification'],
      ['latecoming_flag', 'BOOLEAN', 'Whether the student was late'],
      ['freshness_timestamp', 'TIMESTAMP', 'Latest source update included'],
    ],
  },
  identity: {
    id: 'identity',
    name: 'Student Identity',
    type: 'Standard data product',
    owner: 'Student Data Domain',
    freshness: 'Daily',
    updated: 'Today, 5:52 PM',
    trust: 'Healthy',
    classification: 'Sensitive',
    coverage: 'All active students',
    quality: '99.8% checks passed',
    description: 'Core student identifiers, school, class, level and enrolment context.',
    source: 'Student Management System → Edu Hub',
    definition: 'Authoritative student identity and enrolment context.',
    fields: [
      ['student_id', 'STRING', 'Internal student identifier'],
      ['school_code', 'STRING', 'School identifier'],
      ['class_code', 'STRING', 'Class identifier'],
      ['level', 'STRING', 'Education level'],
      ['enrolment_status', 'STRING', 'Current enrolment status'],
    ],
  },
  calendar: {
    id: 'calendar',
    name: 'School Calendar',
    type: 'Reference dataset',
    owner: 'School Operations',
    freshness: 'Termly',
    updated: '2 Sep 2026',
    trust: 'Healthy',
    classification: 'Internal',
    coverage: 'All schools',
    quality: 'Validated',
    description: 'School terms, holidays and instructional days.',
    source: 'School Operations',
    definition: 'MOE school calendar reference.',
    fields: [
      ['calendar_date', 'DATE', 'Calendar date'],
      ['is_school_day', 'BOOLEAN', 'Whether the date is an instructional day'],
      ['term', 'STRING', 'School term'],
    ],
  },
}

export const metrics = {
  persistentAbsence: {
    name: 'Persistent absence',
    version: 'v3',
    owner: 'Student Data Domain',
    description: 'MOE-governed definition for persistent absence.',
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
  persistentExplorer: {
    name: 'Persistent Absence Explorer',
    description: 'Explore persistent absence using governed definitions.',
    owner: 'Student Data Domain',
    updated: 'Today, 6:04 PM',
    definition: 'Persistent absence v3',
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
    ['Notebook', 'Persistent absence exploration', 'Updated yesterday'],
    ['Data product', 'Student Attendance', 'Healthy'],
    ['Dashboard', 'Attendance Overview', 'Daily'],
  ],
  business: [
    ['Dashboard', 'Student Attendance Overview', 'Updated today'],
    ['Briefing', 'Attendance monthly briefing', '2 days ago'],
    ['Explorer', 'Persistent Absence Explorer', 'Updated today'],
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
