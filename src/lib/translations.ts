export type Language = 'en' | 'bn';

export interface Translations {
  [key: string]: {
    en: string;
    bn: string;
  };
}

export const translations: Translations = {
  // ==========================================
  // 1. BRAND & NAVIGATION
  // ==========================================
  'Madrasa Office': { en: 'Khairul Quran Madrasa Office', bn: 'খাইরুল কুরআন মাদ্রাসা অফিস' },
  'Office Management': { en: 'Office Management', bn: 'অফিস ম্যানেজমেন্ট' },
  'Madrasa Office Management': { en: 'Madrasa Office Management', bn: 'মাদ্রাসা অফিস ম্যানেজমেন্ট' },
  'Madrasa Management System': { en: 'Madrasa Management System', bn: 'মাদ্রাসা ম্যানেজমেন্ট সিস্টেম' },
  'Dashboard': { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  'Students': { en: 'Students', bn: 'শিক্ষার্থী' },
  'Teacher Recruitment': { en: 'Teacher Recruitment', bn: 'শিক্ষক নিয়োগ' },
  'Student List': { en: 'Student List', bn: 'শিক্ষার্থী তালিকা' },
  'Student Admission': { en: 'Student Admission', bn: 'শিক্ষার্থী ভর্তি' },
  'Student Information': { en: 'Student Information', bn: 'শিক্ষার্থী তথ্য' },
  'Student Fees': { en: 'Student Fees', bn: 'শিক্ষার্থী ফি' },
  'Monthly Fees': { en: 'Monthly Fees', bn: 'মাসিক ফি' },
  'Admission Fees': { en: 'Admission Fees', bn: 'ভর্তি ফি' },
  'Other Fees': { en: 'Other Fees', bn: 'অন্যান্য ফি' },
  'Fee Collection': { en: 'Fee Collection', bn: 'ফি আদায়' },
  'Due Fees': { en: 'Due Fees', bn: 'বকেয়া ফি' },
  'Aib Account': { en: 'Aib Account', bn: 'গোরাবাত তহবিল' },
  'Aib Collection': { en: 'Aib Collection', bn: 'গোরাবাত তহবিল সংগ্রহ' },
  'Aib Expense': { en: 'Aib Expense', bn: 'গোরাবাত তহবিল ব্যয়' },
  'Aib Balance': { en: 'Aib Balance', bn: 'গোরাবাত তহবিল ব্যালেন্স' },
  'Aib Transactions': { en: 'Aib Transactions', bn: 'গোরাবাত তহবিল লেনদেন' },
  'Revolving Fund': { en: 'Revolving Fund', bn: 'ঘুরাবা তহবিল' },
  'Fund Collection': { en: 'Fund Collection', bn: 'ঘুরাবা তহবিল সংগ্রহ' },
  'Fund Distribution': { en: 'Fund Distribution', bn: 'ঘুরাবা তহবিল বিতরণ' },
  'Fund Return': { en: 'Fund Return', bn: 'ঘুরাবা তহবিল ফেরত' },
  'Fund Balance': { en: 'Fund Balance', bn: 'ঘুরাবা তহবিল ব্যালেন্স' },
  'Fund Transactions': { en: 'Fund Transactions', bn: 'ঘুরাবা তহবিল লেনদেন' },
  'Boarding': { en: 'Boarding', bn: 'বোর্ডিং (আবাসিক)' },
  'Boarding Students': { en: 'Boarding Students', bn: 'বোর্ডিং শিক্ষার্থী' },
  'Boarding Fees': { en: 'Boarding Fees', bn: 'বোর্ডিং ফি' },
  'Food Expense': { en: 'Food Expense', bn: 'খাবার খরচ' },
  'Other Expenses': { en: 'Other Expenses', bn: 'অন্যান্য খরচ' },
  'Boarding Balance': { en: 'Boarding Balance', bn: 'বোর্ডিং ব্যালেন্স' },
  'Accounts': { en: 'Accounts', bn: 'হিসাবখাত' },
  'Income': { en: 'Income', bn: 'আয়' },
  'Expense': { en: 'Expense', bn: 'ব্যয়' },
  'Transactions': { en: 'Transactions', bn: 'লেনদেনসমূহ' },
  'Balance': { en: 'Balance', bn: 'ব্যালেন্স' },
  'Yearly, Monthly & Daily Reports': { en: 'Yearly, Monthly & Daily Reports', bn: 'বছরওয়ারি, মাসওয়ারি ও দিনওয়ারি হিসাব' },
  'Settings': { en: 'Settings', bn: 'সেটিংস' },
  'Madrasa Information': { en: 'Madrasa Information', bn: 'মাদ্রাসা তথ্য' },
  'User Management': { en: 'User Management', bn: 'ব্যবহারকারী নিয়ন্ত্রণ' },
  'Academic Year': { en: 'Academic Year', bn: 'শিক্ষাবর্ষ' },
  'Classes': { en: 'Classes', bn: 'শ্রেণীসমূহ' },
  'Account Categories': { en: 'Account Categories', bn: 'হিসাব শ্রেণী' },
  'Login / Logout': { en: 'Login / Logout', bn: 'লগইন / লগআউট' },
  'Login': { en: 'Login', bn: 'লগইন' },
  'Logout': { en: 'Logout', bn: 'লগআউট' },
  'Sign Out': { en: 'Sign Out', bn: 'সাইন আউট' },
  'Sign In': { en: 'Sign In', bn: 'সাইন ইন' },
  'Reset Website Data': { en: 'Reset Website Data', bn: 'ওয়েবসাইট ডাটা রিসেট' },
  'Refresh / Reload': { en: 'Refresh / Reload', bn: 'রিফ্রেশ / রিলোড' },
  'Refresh Data': { en: 'Refresh Data', bn: 'ডাটা রিফ্রেশ করুন' },
  'System Restart / Reboot': { en: 'System Restart / Reboot', bn: 'সিস্টেম রিস্টার্ট' },
  'Home': { en: 'Home', bn: 'হোম' },
  'Active Session': { en: 'Active Session', bn: 'সক্রিয় সেশন' },
  'Search records...': { en: 'Search records...', bn: 'রেকর্ড অনুসন্ধান করুন...' },
  'Search records': { en: 'Search records', bn: 'রেকর্ড অনুসন্ধান' },
  'Notifications': { en: 'Notifications', bn: 'বিজ্ঞপ্তি' },
  'Madrasa Settings': { en: 'Madrasa Settings', bn: 'মাদ্রাসা সেটিংস' },
  'Sign Out / Lock': { en: 'Sign Out / Lock', bn: 'সাইন আউট / লক' },
  'active now': { en: 'active now', bn: 'বর্তমানে সক্রিয়' },

  // ==========================================
  // 2. COMMON BUTTONS & ACTIONS
  // ==========================================
  'Save': { en: 'Save', bn: 'সংরক্ষণ করুন' },
  'Save Changes': { en: 'Save Changes', bn: 'পরিবর্তন সংরক্ষণ করুন' },
  'Cancel': { en: 'Cancel', bn: 'বাতিল' },
  'Edit': { en: 'Edit', bn: 'সম্পাদনা' },
  'Delete': { en: 'Delete', bn: 'মুছে ফেলুন' },
  'Add': { en: 'Add', bn: 'যোগ করুন' },
  'Search': { en: 'Search', bn: 'অনুসন্ধান' },
  'View': { en: 'View', bn: 'বিস্তারিত দেখুন' },
  'Confirm': { en: 'Confirm', bn: 'নিশ্চিত করুন' },
  'Confirm Delete': { en: 'Confirm Delete', bn: 'মুছে ফেলা নিশ্চিত করুন' },
  'Submit': { en: 'Submit', bn: 'দাখিল করুন' },
  'Print': { en: 'Print', bn: 'প্রিন্ট' },
  'Print Receipt': { en: 'Print Receipt', bn: 'রশিদ প্রিন্ট' },
  'Download PDF': { en: 'Download PDF', bn: 'পিডিএফ ডাউনলোড' },
  'Reset': { en: 'Reset', bn: 'রিসেট' },
  'Clear': { en: 'Clear', bn: 'পরিষ্কার' },
  'Reset Filters': { en: 'Reset Filters', bn: 'ফিল্টার রিসেট' },
  'Next': { en: 'Next', bn: 'পরবর্তী' },
  'Previous': { en: 'Previous', bn: 'পূর্ববর্তী' },
  'Close': { en: 'Close', bn: 'বন্ধ করুন' },
  'Back': { en: 'Back', bn: 'ফিরে যান' },
  'Filter': { en: 'Filter', bn: 'ফিল্টার' },
  'All': { en: 'All', bn: 'সকল' },
  'Saving...': { en: 'Saving...', bn: 'সংরক্ষণ করা হচ্ছে...' },
  'Deleting...': { en: 'Deleting...', bn: 'মুছে ফেলা হচ্ছে...' },
  'Please Wait...': { en: 'Please Wait...', bn: 'দয়া করে অপেক্ষা করুন...' },
  'Loading...': { en: 'Loading...', bn: 'লোড হচ্ছে...' },
  'Processing...': { en: 'Processing...', bn: 'প্রক্রিয়াধীন...' },
  'Upload': { en: 'Upload', bn: 'আপলোড' },
  'Upload Logo': { en: 'Upload Logo', bn: 'লোগো আপলোড' },
  'Remove Logo': { en: 'Remove Logo', bn: 'লোগো সরান' },
  'Remove photo': { en: 'Remove photo', bn: 'ছবি সরান' },
  'Collect Fee': { en: 'Collect Fee', bn: 'ফি আদায় করুন' },
  'Record Fee Payment': { en: 'Record Fee Payment', bn: 'ফি পেমেন্ট রেকর্ড করুন' },
  'Record Income': { en: 'Record Income', bn: 'আয় রেকর্ড করুন' },
  'Record Expense': { en: 'Record Expense', bn: 'ব্যয় রেকর্ড করুন' },
  'Record Transaction': { en: 'Record Transaction', bn: 'লেনদেন রেকর্ড করুন' },
  'Add Student': { en: 'Add Student', bn: 'শিক্ষার্থী যোগ করুন' },
  'Admit Student': { en: 'Admit Student', bn: 'শিক্ষার্থী ভর্তি' },
  'New Admission': { en: 'New Admission', bn: 'নতুন ভর্তি' },
  'Admit First Student': { en: 'Admit First Student', bn: 'প্রথম শিক্ষার্থী ভর্তি করুন' },
  'Back to Student List': { en: 'Back to Student List', bn: 'শিক্ষার্থী তালিকায় ফিরুন' },
  'Add User Account': { en: 'Add User Account', bn: 'ব্যবহারকারী অ্যাকাউন্ট যোগ' },
  'Add Academic Year': { en: 'Add Academic Year', bn: 'শিক্ষাবর্ষ যোগ করুন' },
  'Add Class': { en: 'Add Class', bn: 'শ্রেণী যোগ করুন' },
  'Add Account Category': { en: 'Add Account Category', bn: 'হিসাব শ্রেণী যোগ' },
  'Update Fee Record': { en: 'Update Fee Record', bn: 'ফি তথ্য আপডেট করুন' },
  'Update Transaction': { en: 'Update Transaction', bn: 'লেনদেন আপডেট করুন' },
  'Update Student': { en: 'Update Student', bn: 'শিক্ষার্থী তথ্য আপডেট' },
  'Save & Update Firestore': { en: 'Save & Update Firestore', bn: 'সংরক্ষণ ও আপডেট করুন' },
  'Activate Term': { en: 'Activate Term', bn: 'সেশন সক্রিয় করুন' },
  'Deactivate': { en: 'Deactivate', bn: 'নিষ্ক্রিয় করুন' },

  // ==========================================
  // 3. TABLE HEADERS & LABELS
  // ==========================================
  'Student ID': { en: 'Student ID', bn: 'শিক্ষার্থী আইডি' },
  'Student Name': { en: 'Student Name', bn: 'শিক্ষার্থীর নাম' },
  'Father Name': { en: 'Father Name', bn: 'পিতার নাম' },
  'Mother Name': { en: 'Mother Name', bn: 'মাতার নাম' },
  'Class': { en: 'Class', bn: 'শ্রেণী' },
  'Section': { en: 'Section', bn: 'শাখা' },
  'Roll': { en: 'Roll', bn: 'রোল' },
  'Roll No': { en: 'Roll No', bn: 'রোল নং' },
  'Phone': { en: 'Phone', bn: 'ফোন নম্বর' },
  'Contact Phone': { en: 'Contact Phone', bn: 'যোগাযোগের ফোন' },
  'Admission Date': { en: 'Admission Date', bn: 'ভর্তির তারিখ' },
  'Status': { en: 'Status', bn: 'অবস্থা' },
  'Actions': { en: 'Actions', bn: 'অ্যাকশন' },
  'Date': { en: 'Date', bn: 'তারিখ' },
  'Type': { en: 'Type', bn: 'ধরণ' },
  'Category': { en: 'Category', bn: 'শ্রেণী / খাত' },
  'Description': { en: 'Description', bn: 'বিবরণ' },
  'Amount': { en: 'Amount', bn: 'পরিমাণ' },
  'Total Amount': { en: 'Total Amount', bn: 'মোট টাকা' },
  'Total Fee': { en: 'Total Fee', bn: 'মোট ফি' },
  'Paid': { en: 'Paid', bn: 'পরিশোধিত' },
  'Paid Amount': { en: 'Paid Amount', bn: 'পরিশোধিত টাকা' },
  'Due': { en: 'Due', bn: 'বকেয়া' },
  'Due Amount': { en: 'Due Amount', bn: 'বকেয়া টাকা' },
  'Payment Method': { en: 'Payment Method', bn: 'পরিশোধ পদ্ধতি' },
  'Payment Date': { en: 'Payment Date', bn: 'পরিশোধের তারিখ' },
  'Receipt No': { en: 'Receipt No', bn: 'রশিদ নম্বর' },
  'Receipt': { en: 'Receipt', bn: 'রশিদ' },
  'Voucher': { en: 'Voucher', bn: 'ভাউচার' },
  'Reference': { en: 'Reference', bn: 'রেফারেন্স' },
  'Ref / Slip #': { en: 'Ref / Slip #', bn: 'রেফ / স্লিপ #' },
  'Note': { en: 'Note', bn: 'মন্তব্য' },
  'Remarks': { en: 'Remarks', bn: 'মন্তব্য' },
  'Remarks / Note': { en: 'Remarks / Note', bn: 'মন্তব্য / নোট' },
  'Month': { en: 'Month', bn: 'মাস' },
  'Fee Month': { en: 'Fee Month', bn: 'ফি এর মাস' },
  'Fee Month / Period': { en: 'Fee Month / Period', bn: 'ফি এর মাস / সময়কাল' },
  'Fee Type': { en: 'Fee Type', bn: 'ফি এর ধরণ' },
  'Room': { en: 'Room', bn: 'রুম' },
  'Room Number': { en: 'Room Number', bn: 'কক্ষ নম্বর' },
  'Bed': { en: 'Bed', bn: 'সীট' },
  'Bed Number': { en: 'Bed Number', bn: 'সীট নম্বর' },
  'Guardian': { en: 'Guardian', bn: 'অভিভাবক' },
  'Guardian Name': { en: 'Guardian Name', bn: 'অভিভাবকের নাম' },
  'Guardian Phone': { en: 'Guardian Phone', bn: 'অভিভাবকের ফোন' },
  'Joining Date': { en: 'Joining Date', bn: 'যোগদানের তারিখ' },
  'Boarding Status': { en: 'Boarding Status', bn: 'বোর্ডিং অবস্থা' },
  'User': { en: 'User', bn: 'ব্যবহারকারী' },
  'Email': { en: 'Email', bn: 'ইমেইল' },
  'System Role': { en: 'System Role', bn: 'সিস্টেম পদবী' },
  'Role': { en: 'Role', bn: 'পদবী' },
  'Last Active': { en: 'Last Active', bn: 'সর্বশেষ সক্রিয়' },
  'Academic Session': { en: 'Academic Session', bn: 'শিক্ষাবর্ষ সেশন' },
  'Hijri Year': { en: 'Hijri Year', bn: 'হিজরী সন' },
  'Created At': { en: 'Created At', bn: 'তৈরির সময়' },
  'Sections': { en: 'Sections', bn: 'সেকশন' },
  'Class Teacher': { en: 'Class Teacher', bn: 'ক্লাস টিচার' },
  'Standard Monthly Fee': { en: 'Standard Monthly Fee', bn: 'স্ট্যান্ডার্ড মান্থ ফি' },
  'Capacity / Status': { en: 'Capacity / Status', bn: 'ক্যাপাসিটি স্ট্যাটাস' },
  'Person / Source Name': { en: 'Person / Source Name', bn: 'ব্যক্তি / উৎসের নাম' },
  'Donor / Contributor': { en: 'Donor / Contributor', bn: 'দাতা / সাহায্যকারী' },
  'Beneficiary': { en: 'Beneficiary', bn: 'সুবিধাভোগী' },

  // ==========================================
  // 4. STATUSES & BADGES
  // ==========================================
  'Active': { en: 'Active', bn: 'সক্রিয়' },
  'Inactive': { en: 'Inactive', bn: 'নিষ্ক্রিয়' },
  'Graduated': { en: 'Graduated', bn: 'উত্তীর্ণ' },
  'Left': { en: 'Left', bn: 'অব্যাহতিপ্রাপ্ত' },
  'On Leave': { en: 'On Leave', bn: 'ছুটিতে' },
  'Completed': { en: 'Completed', bn: 'সম্পন্ন' },
  'Pending': { en: 'Pending', bn: 'অপেক্ষমাণ' },
  'Cancelled': { en: 'Cancelled', bn: 'বাতিলকৃত' },
  'Collection': { en: 'Collection', bn: 'সংগ্রহ' },
  'Distribution': { en: 'Distribution', bn: 'বিতরণ' },
  'Return': { en: 'Return', bn: 'ফেরত' },
  'Cash': { en: 'Cash', bn: 'নগদ' },
  'Bank': { en: 'Bank', bn: 'ব্যাংক' },
  'Mobile Banking': { en: 'Mobile Banking', bn: 'মোবাইল ব্যাংকিং' },
  'Other': { en: 'Other', bn: 'অন্যান্য' },
  'All Classes': { en: 'All Classes', bn: 'সকল শ্রেণী' },
  'All Status': { en: 'All Status', bn: 'সকল অবস্থা' },
  'All Statuses': { en: 'All Statuses', bn: 'সকল অবস্থা' },
  'All Types': { en: 'All Types', bn: 'সকল ধরণ' },
  'All Months': { en: 'All Months', bn: 'সকল মাস' },
  'All Methods': { en: 'All Methods', bn: 'সকল মাধ্যম' },
  'All Categories': { en: 'All Categories', bn: 'সকল খাত' },

  // ==========================================
  // 5. DASHBOARD SPECIFIC
  // ==========================================
  'Darul Uloom Central Office': { en: 'Darul Uloom Central Office', bn: 'দারুল উলূম কেন্দ্রীয় অফিস' },
  'Academic Session 2026–2027 (1447–1448 AH) · Administrative Desk': {
    en: 'Academic Session 2026–2027 (1447–1448 AH) · Administrative Desk',
    bn: 'শিক্ষাবর্ষ ২০২৬–২০২৭ (১৪৪৭–১৪৪৮ হিজরী) · প্রশাসনিক ডেস্ক',
  },
  'Status: Active Operations': { en: 'Status: Active Operations', bn: 'অবস্থা: সক্রিয় কার্যক্রম' },
  'Total Students': { en: 'Total Students', bn: 'মোট শিক্ষার্থী' },
  'Enrolled across all classes': { en: 'Enrolled across all classes', bn: 'সকল শ্রেণীতে সর্বমোট ভর্তি' },
  'New Admissions': { en: 'New Admissions', bn: 'নতুন ভর্তি' },
  'Enrolled this term': { en: 'Enrolled this term', bn: 'চলতি সেশনে ভর্তিকৃত' },
  'Total Teachers': { en: 'Total Teachers', bn: 'মোট উস্তাদ / শিক্ষক' },
  'Faculty & staff': { en: 'Faculty & staff', bn: 'শিক্ষক ও স্টাফ' },
  'Monthly Income': { en: 'Monthly Income', bn: 'মাসিক আয়' },
  'Monthly Revenue': { en: 'Monthly Revenue', bn: 'মাসিক রাজস্ব' },
  'Monthly Expense': { en: 'Monthly Expense', bn: 'মাসিক ব্যয়' },
  'Monthly Expenses': { en: 'Monthly Expenses', bn: 'মাসিক ব্যয়' },
  'Current Balance': { en: 'Current Balance', bn: 'বর্তমান ব্যালেন্স' },
  'Net office reserve': { en: 'Net office reserve', bn: 'অফিস নগদ উদ্বৃত্ত' },
  'Net liquid reserve': { en: 'Net liquid reserve', bn: 'নগদ তরল তহবিল' },
  'Total Cash Balance': { en: 'Total Cash Balance', bn: 'মোট নগদ ব্যালেন্স' },
  'Recent Fees Collected': { en: 'Recent Fees Collected', bn: 'সম্প্রতি সংগৃহীত ফি' },
  'Madrasa Balance Sheet Overview': { en: 'Madrasa Balance Sheet Overview', bn: 'মাদ্রাসা ব্যালেন্স শীট ওভারভিউ' },
  'Monthly Revenue & Cash Flow': { en: 'Monthly Revenue & Cash Flow', bn: 'মাসিক রাজস্ব ও ক্যাশ ফ্লো' },
  'Income vs Expense comparisons across active terms': {
    en: 'Income vs Expense comparisons across active terms',
    bn: 'সক্রিয় সেশনের আয় বনাম ব্যয়ের তুলনামূলক চিত্র',
  },
  'Student Distribution by Department': { en: 'Student Distribution by Department', bn: 'বিভাগ অনুযায়ী শিক্ষার্থী বন্টন' },
  'Active enrollment count': { en: 'Active enrollment count', bn: 'সক্রিয় শিক্ষার্থী সংখ্যা' },
  'Recent Office Financial Vouchers': { en: 'Recent Office Financial Vouchers', bn: 'সাম্প্রতিক অফিস লেনদেন ভাউচার' },
  'Live ledger transactions from Google Cloud Firestore': {
    en: 'Live ledger transactions from Google Cloud Firestore',
    bn: 'ফায়ারস্টোর ডাটাবেজ থেকে সরাসরি লেনদেন তালিকা',
  },
  'View All Accounts': { en: 'View All Accounts', bn: 'সকল হিসাব দেখুন' },
  'Quick Office Actions': { en: 'Quick Office Actions', bn: 'দ্রুত অফিস অ্যাকশন' },
  'New Student Admission': { en: 'New Student Admission', bn: 'নতুন শিক্ষার্থী ভর্তি' },
  'Admit student to class': { en: 'Admit student to class', bn: 'শ্রেণীতে ছাত্র ভর্তি করুন' },
  'Collect Monthly Fee': { en: 'Collect Monthly Fee', bn: 'মাসিক ফি আদায়' },
  'Issue student fee receipt': { en: 'Issue student fee receipt', bn: 'ফি রশিদ প্রদান করুন' },
  'Record Office Expense': { en: 'Record Office Expense', bn: 'অফিস খরচ লিপিবদ্ধ করুন' },
  'Add expense ledger entry': { en: 'Add expense ledger entry', bn: 'খরচ লেজারে এন্ট্রি করুন' },
  'Aib Account Donation': { en: 'Aib Account Donation', bn: 'গোরাবাত তহবিল অনুদান' },
  'Record welfare contribution': { en: 'Record welfare contribution', bn: 'সাহায্য ও দান সংগ্রহ' },
  'Revolving Fund Aid': { en: 'Revolving Fund Aid', bn: 'আবর্তনশীল তহবিল সাহায্য' },
  'Qard-e-Hasana distribution': { en: 'Qard-e-Hasana distribution', bn: 'ক্বরযে হাসানা বিতরণ' },
  'Boarding Hostels': { en: 'Boarding Hostels', bn: 'বোর্ডিং ছাত্রাবাস' },
  'Hostel & mess management': { en: 'Hostel & mess management', bn: 'ছাত্রাবাস ও মেস ব্যবস্থাপনা' },

  // ==========================================
  // 6. STUDENTS MODULE
  // ==========================================
  'Student Registry Directory': { en: 'Student Registry Directory', bn: 'শিক্ষার্থী রেজিস্ট্রি ডিরেক্টরি' },
  'Real-time students database with full admission details': {
    en: 'Real-time students database with full admission details',
    bn: 'শিক্ষার্থীদের পূর্ণ ভর্তি তথ্যসহ সরাসরি ডাটাবেজ',
  },
  'Filter Students': { en: 'Filter Students', bn: 'শিক্ষার্থী ফিল্টার' },
  'Search by Name, Student ID, Father Name, Phone...': {
    en: 'Search by Name, Student ID, Father Name, Phone...',
    bn: 'নাম, শিক্ষার্থী আইডি, পিতার নাম, ফোন দিয়ে খুঁজুন...',
  },
  'Clear filters': { en: 'Clear filters', bn: 'ফিল্টার মুছুন' },
  'Clear all filters': { en: 'Clear all filters', bn: 'সকল ফিল্টার পরিষ্কার করুন' },
  'No students found.': { en: 'No students found.', bn: 'কোন শিক্ষার্থী পাওয়া যায়নি।' },
  'No students match your filter criteria.': {
    en: 'No students match your filter criteria.',
    bn: 'আপনার ফিল্টারের সাথে মিলে এমন কোনো শিক্ষার্থী পাওয়া যায়নি।',
  },
  'View student file': { en: 'View student file', bn: 'শিক্ষার্থী ফাইল দেখুন' },
  'Edit student': { en: 'Edit student', bn: 'শিক্ষার্থী সম্পাদনা' },
  'Delete student': { en: 'Delete student', bn: 'শিক্ষার্থী মুছে ফেলুন' },
  'Student Delete': { en: 'Student Delete', bn: 'শিক্ষার্থী মুছে ফেলা' },
  'Confirm deletion from Google Cloud Firestore': {
    en: 'Confirm deletion from Google Cloud Firestore',
    bn: 'ফায়ারস্টোর ডাটাবেজ থেকে মুছে ফেলার নিশ্চিতকরণ',
  },
  'Are you sure you want to delete this student from the active registry?': {
    en: 'Are you sure you want to delete this student from the active registry?',
    bn: 'আপনি কি নিশ্চিত যে এই শিক্ষার্থীকে সক্রিয় তালিকা থেকে মুছে ফেলতে চান?',
  },
  'Permanent Database Action': { en: 'Permanent Database Action', bn: 'স্থায়ী ডাটাবেজ পদক্ষেপ' },
  'Financial History Notice': { en: 'Financial History Notice', bn: 'আর্থিক লেনদেন সংক্রান্ত সতর্কতা' },
  'Student Edit': { en: 'Student Edit', bn: 'শিক্ষার্থী তথ্য সম্পাদনা' },
  'Modify student profile': { en: 'Modify student profile', bn: 'শিক্ষার্থী প্রোফাইল সংশোধন করুন' },
  'Full Name': { en: 'Full Name', bn: 'সম্পূর্ণ নাম' },
  'Date of Birth': { en: 'Date of Birth', bn: 'জন্ম তারিখ' },
  'Residential Address': { en: 'Residential Address', bn: 'আবাসিক ঠিকানা' },
  'Residential Address / Village': { en: 'Residential Address / Village', bn: 'আবাসিক ঠিকানা / গ্রাম' },
  'Student Admission Form': { en: 'Student Admission Form', bn: 'শিক্ষার্থী ভর্তি ফর্ম' },
  'Register New Student': { en: 'Register New Student', bn: 'নতুন শিক্ষার্থী নিবন্ধন' },
  'Student Personal Details': { en: 'Student Personal Details', bn: 'শিক্ষার্থীর ব্যক্তিগত বিবরণ' },
  'Academic Enrollment Details': { en: 'Academic Enrollment Details', bn: 'শিক্ষা ভর্তি বিবরণ' },
  'Student Photo': { en: 'Student Photo', bn: 'শিক্ষার্থীর ছবি' },
  'Upload Student Photo': { en: 'Upload Student Photo', bn: 'শিক্ষার্থীর ছবি আপলোড' },
  'Change Student Photo': { en: 'Change Student Photo', bn: 'ছবি পরিবর্তন করুন' },
  'Click to upload passport-size photo': {
    en: 'Click to upload passport-size photo',
    bn: 'পাসপোর্ট সাইজ ছবি আপলোড করতে ক্লিক করুন',
  },
  'Boarding Student (Hostel Resident)': {
    en: 'Boarding Student (Hostel Resident)',
    bn: 'বোর্ডিং শিক্ষার্থী (ছাত্রাবাস নিবাসী)',
  },
  'Yes, student resides in Madrasa boarding': {
    en: 'Yes, student resides in Madrasa boarding',
    bn: 'হ্যাঁ, শিক্ষার্থী মাদ্রাসার বোর্ডিংয়ে অবস্থান করবে',
  },
  'Assigned Room Number': { en: 'Assigned Room Number', bn: 'বরাদ্দকৃত কক্ষ নম্বর' },
  'Submit Admission': { en: 'Submit Admission', bn: 'ভর্তি সম্পন্ন করুন' },
  'Reset Form': { en: 'Reset Form', bn: 'ফর্ম রিসেট করুন' },
  'Student Information Card': { en: 'Student Information', bn: 'শিক্ষার্থী তথ্য' },
  'Individual student registry profile, personal records, and academic information': {
    en: 'Individual student registry profile, personal records, and academic information',
    bn: 'শিক্ষার্থীর ব্যক্তিগত ও প্রাতিষ্ঠানিক বিস্তারিত তথ্যাবলী',
  },
  'Student Record Profile': { en: 'Student Record Profile', bn: 'শিক্ষার্থী রেকর্ড প্রোফাইল' },
  'Quick Actions': { en: 'Quick Actions', bn: 'কুইক অ্যাকশন' },
  'Collect Due Fees': { en: 'Collect Due Fees', bn: 'বকেয়া ফি আদায়' },
  'Academic Records': { en: 'Academic Records', bn: 'শিক্ষাগত রেকর্ড' },
  'Payment History': { en: 'Payment History', bn: 'ফি পরিশোধের ইতিহাস' },

  // ==========================================
  // 7. STUDENT FEES MODULE
  // ==========================================
  'Collect Student Fee': { en: 'Collect Student Fee', bn: 'শিক্ষার্থী ফি আদায়' },
  'Record payment voucher': { en: 'Record payment voucher', bn: 'পেমেন্ট ভাউচার লিপিবদ্ধ করুন' },
  'Select Student': { en: 'Select Student', bn: 'শিক্ষার্থী নির্বাচন করুন' },
  'Search student by name or ID...': { en: 'Search student by name or ID...', bn: 'নাম বা আইডি দিয়ে খুঁজুন...' },
  'Auto-Populated Student Details': { en: 'Auto-Populated Student Details', bn: 'স্বয়ংক্রিয় শিক্ষার্থী বিবরণ' },
  'Select a student on the left to automatically populate details.': {
    en: 'Select a student on the left to automatically populate details.',
    bn: 'বিবরণ দেখতে বামপাশ থেকে একজন শিক্ষার্থী নির্বাচন করুন।',
  },
  'Total Fee Amount': { en: 'Total Fee Amount', bn: 'মোট ফি পরিমাণ' },
  'Now Paying Amount': { en: 'Now Paying Amount', bn: 'বর্তমান পরিশোধের টাকা' },
  'Remaining Due': { en: 'Remaining Due', bn: 'অবশিষ্ট বকেয়া' },
  'Fee Payment Method': { en: 'Payment Method', bn: 'পরিশোধ মাধ্যম' },
  'Transaction / Bank Slip Reference': { en: 'Transaction / Bank Slip Reference', bn: 'লেনদেন / ব্যাংক স্লিপ রেফারেন্স' },
  'Payment Note / Purpose': { en: 'Payment Note / Purpose', bn: 'পেমেন্ট নোট / উদ্দেশ্য' },
  'Complete Fee Payment': { en: 'Complete Fee Payment', bn: 'ফি প্রদান সম্পন্ন করুন' },
  'Fee Records Ledger': { en: 'Fee Records Ledger', bn: 'ফি রেকর্ড লেজার' },
  'Search by Student ID, Student Name, Father Name...': {
    en: 'Search by Student ID, Student Name, Father Name...',
    bn: 'শিক্ষার্থী আইডি, নাম, পিতার নাম দিয়ে খুঁজুন...',
  },
  'No fee records found.': { en: 'No fee records found.', bn: 'কোনো ফি রেকর্ড পাওয়া যায়নি।' },
  'Official Student Fee Receipt': { en: 'Official Student Fee Receipt', bn: 'অফিসিয়াল শিক্ষার্থী ফি রশিদ' },
  'Delete Fee Record': { en: 'Delete Fee Record', bn: 'ফি রেকর্ড মুছে ফেলুন' },
  'Delete Fee Transaction': { en: 'Delete Fee Transaction', bn: 'ফি লেনদেন মুছে ফেলুন' },
  'Are you sure you want to delete this fee transaction?': {
    en: 'Are you sure you want to delete this fee transaction?',
    bn: 'আপনি কি নিশ্চিত যে এই ফি লেনদেনটি মুছে ফেলতে চান?',
  },
  'This fee document will be permanently deleted from the collection': {
    en: 'This fee document will be permanently deleted from the collection',
    bn: 'এই ফি নথিটি ডাটাবেজ থেকে স্থায়ীভাবে মুছে যাবে',
  },
  'Recalculated Due': { en: 'Recalculated Due', bn: 'পুনঃগণনাকৃত বকেয়া' },
  'Total Collected Fees': { en: 'Total Collected Fees', bn: 'মোট আদায়কৃত ফি' },
  'Total Pending Dues': { en: 'Total Pending Dues', bn: 'মোট বকেয়া ফি' },
  'Paid In Full': { en: 'Paid In Full', bn: 'সম্পূর্ণ পরিশোধিত' },

  // ==========================================
  // 8. AIB ACCOUNT MODULE
  // ==========================================
  'Aib Account (Endowment & Welfare)': { en: 'Aib Account (Endowment & Welfare)', bn: 'গোরাবাত তহবিল (দান ও কল্যাণ তহবিল)' },
  'Endowment funds, donations, and welfare expenses registry': {
    en: 'Endowment funds, donations, and welfare expenses registry',
    bn: 'মাদ্রাসার ওয়াকফ, দান-সদকা ও কল্যাণমূলক ব্যয়ের রেজিস্ট্রি',
  },
  'Total Aib Balance': { en: 'Total Aib Balance', bn: 'গোরাবাত মোট ব্যালেন্স' },
  'Total Collection': { en: 'Total Collection', bn: 'মোট সংগ্রহ' },
  'Total Expense': { en: 'Total Expense', bn: 'মোট খরচ' },
  'Net Available Balance': { en: 'Net Available Balance', bn: 'মোট অবশিষ্ট ব্যালেন্স' },
  'Record Aib Collection': { en: 'Record Aib Collection', bn: 'গোরাবাত তহবিল সংগ্রহ রেকর্ড করুন' },
  'Record Aib Expense': { en: 'Record Aib Expense', bn: 'গোরাবাত তহবিল ব্যয় রেকর্ড করুন' },
  'Record Aib Transaction': { en: 'Record Aib Transaction', bn: 'গোরাবাত তহবিল লেনদেন রেকর্ড করুন' },
  'Aib Transaction Ledger': { en: 'Aib Transaction Ledger', bn: 'গোরাবাত তহবিল লেনদেন লেজার' },
  'Edit Transaction': { en: 'Edit Transaction', bn: 'লেনদেন সম্পাদনা' },
  'Delete Transaction': { en: 'Delete Transaction', bn: 'লেনদেন মুছে ফেলুন' },
  'Confirm Transaction Deletion': { en: 'Confirm Transaction Deletion', bn: 'লেনদেন মুছে ফেলার নিশ্চিতকরণ' },
  'Are you sure you want to delete this transaction record?': {
    en: 'Are you sure you want to delete this transaction record?',
    bn: 'আপনি কি নিশ্চিত যে এই লেনদেনের রেকর্ডটি মুছে ফেলতে চান?',
  },

  // ==========================================
  // 9. REVOLVING FUND MODULE
  // ==========================================
  'Revolving Fund (Qard-e-Hasana)': { en: 'Revolving Fund (Qard-e-Hasana)', bn: 'আবর্তনশীল তহবিল (ক্বরযে হাসানা)' },
  'Self-replenishing community fund distributions and returns': {
    en: 'Self-replenishing community fund distributions and returns',
    bn: 'ঘূর্ণায়মান তহবিল সংগ্রহ, করজ বিতরণ এবং ফেরত রেজিস্ট্রি',
  },
  'Total Revolving Balance': { en: 'Total Revolving Balance', bn: 'মোট আবর্তনশীল তহবিল' },
  'Total Disbursed': { en: 'Total Disbursed', bn: 'মোট বিতরণকৃত করজ' },
  'Total Returned': { en: 'Total Returned', bn: 'মোট ফেরতপ্রাপ্ত করজ' },
  'Record Fund Collection': { en: 'Record Fund Collection', bn: 'তহবিল সংগ্রহ রেকর্ড করুন' },
  'Record Fund Distribution': { en: 'Record Fund Distribution', bn: 'তহবিল বিতরণ রেকর্ড করুন' },
  'Record Fund Return': { en: 'Record Fund Return', bn: 'তহবিল ফেরত রেকর্ড করুন' },
  'Fund Transactions Ledger': { en: 'Fund Transactions Ledger', bn: 'তহবিল লেনদেন লেজার' },

  // ==========================================
  // 10. BOARDING MODULE
  // ==========================================
  'Boarding & Hostel Management': { en: 'Boarding & Hostel Management', bn: 'বোর্ডিং ও ছাত্রাবাস ব্যবস্থাপনা' },
  'Residential student lodgings, hostel fees, kitchen rations and maintenance': {
    en: 'Residential student lodgings, hostel fees, kitchen rations and maintenance',
    bn: 'আবাসিক ছাত্রাবাস, মেস ফি, খাবার রেশনের খরচ ও তত্ত্বাবধান',
  },
  'Total Residents': { en: 'Total Residents', bn: 'মোট আবাসিক ছাত্র' },
  'Active Boarders': { en: 'Active Boarders', bn: 'সক্রিয় আবাসিক ছাত্র' },
  'Monthly Boarding Fees': { en: 'Monthly Boarding Fees', bn: 'মাসিক বোর্ডিং ফি' },
  'Food & Ration Expense': { en: 'Food & Ration Expense', bn: 'খাবার ও রেশন খরচ' },
  'Hostel Utility Expense': { en: 'Hostel Utility Expense', bn: 'ছাত্রাবাস অন্যান্য খরচ' },
  'Add Boarding Student': { en: 'Add Boarding Student', bn: 'বোর্ডিং ছাত্র যুক্ত করুন' },
  'Record Boarding Fee': { en: 'Record Boarding Fee', bn: 'বোর্ডিং ফি আদায়' },
  'Record Food Expense': { en: 'Record Food Expense', bn: 'খাবার খরচ লিপিবদ্ধ করুন' },
  'Record Other Expense': { en: 'Record Other Expense', bn: 'অন্যান্য খরচ লিপিবদ্ধ করুন' },
  'Edit Resident': { en: 'Edit Resident', bn: 'আবাসিক ছাত্র সম্পাদনা' },
  'Remove Resident': { en: 'Remove Resident', bn: 'আবাসিক ছাত্র সরান' },

  // ==========================================
  // 11. ACCOUNTS MODULE
  // ==========================================
  'Central Accounts & Cash Book': { en: 'Central Accounts & Cash Book', bn: 'কেন্দ্রীয় হিসাব ও ক্যাশ বুক' },
  'Institutional financial ledger, vouchers, and cash balance': {
    en: 'Institutional financial ledger, vouchers, and cash balance',
    bn: 'প্রতিষ্ঠানের আর্থিক খতিয়ান, ভাউচার ও নগদ জমার হিসাব',
  },
  'Total General Income': { en: 'Total General Income', bn: 'মোট সাধারণ আয়' },
  'Total General Expense': { en: 'Total General Expense', bn: 'মোট সাধারণ ব্যয়' },
  'Net Operating Balance': { en: 'Net Operating Balance', bn: 'মোট পরিচালন উদ্বৃত্ত' },
  'Cash In Hand': { en: 'Cash In Hand', bn: 'নগদ হাতে জমা' },
  'Bank Balance': { en: 'Bank Balance', bn: 'ব্যাংক জমা' },
  'Mobile Account': { en: 'Mobile Account', bn: 'মোবাইল একাউন্ট' },
  'Income & Revenue Ledger': { en: 'Income & Revenue Ledger', bn: 'আয় ও রাজস্ব খতিয়ান' },
  'Expense & Payment Vouchers': { en: 'Expense & Payment Vouchers', bn: 'ব্যয় ও পেমেন্ট ভাউচার' },
  'All Transactions Registry': { en: 'All Transactions Registry', bn: 'সর্বমোট লেনদেন রেজিস্ট্রি' },
  'View Voucher': { en: 'View Voucher', bn: 'ভাউচার দেখুন' },
  'Official Accounting Voucher': { en: 'Official Accounting Voucher', bn: 'অফিসিয়াল হিসাব ভাউচার' },

  // ==========================================
  // 12. SETTINGS MODULE
  // ==========================================
  'Madrasa Institutional Profile': { en: 'Madrasa Institutional Profile', bn: 'মাদ্রাসা প্রাতিষ্ঠানিক প্রোফাইল' },
  'Update official institution information, contact, and bank coordinates': {
    en: 'Update official institution information, contact, and bank coordinates',
    bn: 'প্রাতিষ্ঠানিক তথ্য, ঠিকানা, ফোন ও ব্যাংক হিসাব পরিচালনা',
  },
  'Madrasa Official Name': { en: 'Madrasa Official Name', bn: 'মাদ্রাসার দাপ্তরিক নাম' },
  'Arabic / Secondary Title': { en: 'Arabic / Secondary Title', bn: 'আরবি / দ্বিতীয় নাম' },
  'Registration / EIN Number': { en: 'Registration / EIN Number', bn: 'রেজিস্ট্রেশন নম্বর' },
  'Principal / Muhtamim': { en: 'Principal / Muhtamim', bn: 'মুহতামিম / অধ্যক্ষ' },
  'Official Phone': { en: 'Official Phone', bn: 'অফিসিয়াল ফোন' },
  'Official Email': { en: 'Official Email', bn: 'অফিসিয়াল ইমেইল' },
  'Bank Name': { en: 'Bank Name', bn: 'ব্যাংকের নাম' },
  'Bank Account Number': { en: 'Bank Account Number', bn: 'ব্যাংক হিসাব নম্বর' },
  'Established Year': { en: 'Established Year', bn: 'স্থাপিত সন' },
  'Website URL': { en: 'Website URL', bn: 'ওয়েবসাইট লিঙ্ক' },
  'Physical Address': { en: 'Physical Address', bn: 'প্রতিষ্ঠানের ঠিকানা' },
  'Save Institutional Profile': { en: 'Save Institutional Profile', bn: 'প্রতিষ্ঠান তথ্য সংরক্ষণ করুন' },
  'Office Users & Administrative Roles': { en: 'Office Users & Administrative Roles', bn: 'অফিস ব্যবহারকারী ও এডমিন পদবী' },
  'Assign permission levels for office staff and accountants': {
    en: 'Assign permission levels for office staff and accountants',
    bn: 'অফিস কর্মী ও হিসাবরক্ষকদের দায়িত্ব ও অনুমতি প্রদান',
  },
  'Academic Year & Term Config': { en: 'Academic Year & Term Config', bn: 'শিক্ষাবর্ষ ও সেশন সেটিংস' },
  'Manage academic sessions, current active terms, and system-wide dates': {
    en: 'Manage academic sessions, current active terms, and system-wide dates',
    bn: 'শিক্ষাবর্ষ, সক্রিয় সেশন এবং শিক্ষা ক্যালেন্ডার পরিচালনা',
  },
  'Academic Classes & Enrolled Sections': { en: 'Academic Classes & Enrolled Sections', bn: 'একাডেমিক ক্লাস ও ইনরোল সেকশন' },
  'Manage madrasa academic curriculum levels, class teachers and student capacities': {
    en: 'Manage madrasa academic curriculum levels, class teachers and student capacities',
    bn: 'মাদ্রাসার শ্রেণী, দায়িত্বপ্রাপ্ত শিক্ষক ও নির্ধারিত ফি পরিচালনা',
  },
  'Account Categories & Ledger Heads': { en: 'Account Categories & Ledger Heads', bn: 'হিসাবখাত ও লেজার হেডস' },
  'Income Categories (Ledger Heads)': { en: 'Income Categories (Ledger Heads)', bn: 'আয়ের খাতসমূহ (লেজার হেড)' },
  'Expense Categories (Voucher Heads)': { en: 'Expense Categories (Voucher Heads)', bn: 'ব্যয়ের খাতসমূহ (ভাউচার হেড)' },
  'Danger Zone: Reset Website Data': { en: 'Danger Zone: Reset Website Data', bn: 'সতর্কতা: ওয়েবসাইট ডাটা রিসেট' },
  'System Restart / Reboot Notice': { en: 'System Restart / Reboot Notice', bn: 'সিস্টেম রিস্টার্ট সতর্কতা' },
  'Confirm System Restart': { en: 'Confirm System Restart', bn: 'সিস্টেম রিস্টার্ট নিশ্চিত করুন' },
  'Confirm Reset Website Data': { en: 'Confirm Reset Website Data', bn: 'ডাটা রিসেট নিশ্চিত করুন' },

  // ==========================================
  // 13. AUTHENTICATION & LOGIN
  // ==========================================
  'Sign in to Madrasa Management': { en: 'Sign in to Madrasa Management', bn: 'মাদ্রাসা ম্যানেজমেন্টে সাইন ইন করুন' },
  'Enter administrative credentials to access office console': {
    en: 'Enter administrative credentials to access office console',
    bn: 'অফিস কনসোলে প্রবেশের জন্য আপনার প্রশাসনিক পাসওয়ার্ড দিন',
  },
  'Email Address': { en: 'Email Address', bn: 'ইমেইল ঠিকানা' },
  'Password': { en: 'Password', bn: 'পাসওয়ার্ড' },
  'Sign In to Office Console': { en: 'Sign In to Office Console', bn: 'অফিস কনসোলে প্রবেশ করুন' },
  'Authenticate with Google Workspace': { en: 'Authenticate with Google Workspace', bn: 'গুগল দিয়ে সাইন ইন করুন' },
  'Use Demo Administrator Login': { en: 'Use Demo Administrator Login', bn: 'এডমিন ডেমো লগইন ব্যবহার করুন' },
  'Authorized Administrative Personnel Only': {
    en: 'Authorized Administrative Personnel Only',
    bn: 'কেবলমাত্র অনুমোদিত প্রশাসনিক কর্মকর্তা ও স্টাফদের জন্য',
  },

  // ==========================================
  // 14. NOTIFICATIONS, ALERTS & MESSAGES
  // ==========================================
  'Success': { en: 'Success', bn: 'সফল হয়েছে' },
  'Error': { en: 'Error', bn: 'ত্রুটি' },
  'Notice': { en: 'Notice', bn: 'বিজ্ঞপ্তি' },
  'Access Denied': { en: 'Access Denied', bn: 'প্রবেশাধিকার নেই' },
  'Staff users cannot modify institutional settings.': {
    en: 'Staff users cannot modify institutional settings.',
    bn: 'স্টাফ ব্যবহারকারীরা প্রাতিষ্ঠানিক তথ্য পরিবর্তন করতে পারবেন না।',
  },
  'Student deleted successfully': { en: 'Student deleted successfully', bn: 'শিক্ষার্থী সফলভাবে মুছে ফেলা হয়েছে' },
  'Student admitted successfully': { en: 'Student admitted successfully', bn: 'শিক্ষার্থী সফলভাবে ভর্তি করা হয়েছে' },
  'Student updated successfully': { en: 'Student updated successfully', bn: 'শিক্ষার্থী তথ্য সফলভাবে আপডেট হয়েছে' },
  'Fee collected successfully': { en: 'Fee collected successfully', bn: 'ফি সফলভাবে আদায় ও সংরক্ষিত হয়েছে' },
  'Fee record updated': { en: 'Fee record updated', bn: 'ফি রেকর্ড আপডেট হয়েছে' },
  'Fee record deleted': { en: 'Fee record deleted', bn: 'ফি রেকর্ড মুছে ফেলা হয়েছে' },
  'Transaction recorded successfully': { en: 'Transaction recorded successfully', bn: 'লেনদেন সফলভাবে লিপিবদ্ধ হয়েছে' },
  'Settings saved successfully': { en: 'Settings saved successfully', bn: 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে' },

  // ==========================================
  // 15. COMPREHENSIVE MODULE LABELS & DIALOGS
  // ==========================================
  // Aib Account
  'Donations, Waqf endowments, and earmarked charitable receipts': {
    en: 'Donations, Waqf endowments, and earmarked charitable receipts',
    bn: 'দান-অনুদান, ওয়াকফ তহবিল এবং দাতব্য প্রাপ্তি',
  },
  'Disbursements for designated student welfare, stipends, and grants': {
    en: 'Disbursements for designated student welfare, stipends, and grants',
    bn: 'শিক্ষার্থী কল্যাণ, উপবৃত্তি এবং অনুদানের বিতরণ',
  },
  'Overview of the Aib endowment account reserve and ledger positions': {
    en: 'Overview of the Aib endowment account reserve and ledger positions',
    bn: 'গোরাবাত ওয়াকফ একাউন্টের তহবিল ও ব্যালেন্স পর্যালোচনা',
  },
  'Master ledger of all Aib collections and expense postings': {
    en: 'Master ledger of all Aib collections and expense postings',
    bn: 'সকল গোরাবাত তহবিল সংগ্রহ ও ব্যয়ের প্রধান লেজার',
  },
  'Special endowment and welfare funds ledger': {
    en: 'Special endowment and welfare funds ledger',
    bn: 'বিশেষ ওয়াকফ ও কল্যাণ তহবিলের খতিয়ান',
  },
  'All cumulative Aib endowment receipts': {
    en: 'All cumulative Aib endowment receipts',
    bn: 'মোট সংগৃহীত গোরাবাত প্রাপ্তি',
  },
  'Cumulative aid and welfare disbursements': {
    en: 'Cumulative aid and welfare disbursements',
    bn: 'মোট বিতরণকৃত সাহায্য ও ব্যয়',
  },
  'Net available Aib account balance': {
    en: 'Net available Aib account balance',
    bn: 'গোরাবাত তহবিলের মোট বর্তমান ব্যালেন্স',
  },
  'Aib Reserve Reconciliation Statement': {
    en: 'Aib Reserve Reconciliation Statement',
    bn: 'গোরাবাত তহবিল সমন্বয় বিবরণী',
  },
  'Total Aib Collection': {
    en: 'Total Aib Collection',
    bn: 'মোট গোরাবাত তহবিল সংগ্রহ',
  },
  'Total Aib Expense': {
    en: 'Total Aib Expense',
    bn: 'মোট গোরাবাত তহবিল ব্যয়',
  },
  'Net Aib Reserve Balance': {
    en: 'Net Aib Reserve Balance',
    bn: 'গোরাবাত তহবিলের নিট উদ্বৃত্ত',
  },
  'Search by desc, category, ref, note...': {
    en: 'Search by desc, category, ref, note...',
    bn: 'বিবরণ, ক্যাটাগরি, রেফারেন্স দিয়ে খুঁজুন...',
  },
  'All Aib Categories': { en: 'All Categories', bn: 'সকল খাত' },
  'All Aib Methods': { en: 'All Methods', bn: 'সকল মাধ্যম' },
  'All Aib Types': { en: 'All Types', bn: 'সকল ধরণ' },
  'All Rooms': { en: 'All Rooms', bn: 'সকল কক্ষ' },
  'All Aib Months': { en: 'All Months', bn: 'সকল মাস' },
  'All Aib Classes': { en: 'All Classes', bn: 'সকল শ্রেণী' },
  'All Aib Status': { en: 'All Status', bn: 'সকল অবস্থা' },
  'Description / Particulars': { en: 'Description / Particulars', bn: 'বিবরণ / খাত' },
  'Particulars / Description': { en: 'Particulars / Description', bn: 'বিবরণ / খাত' },
  'Aib Ref / Slip #': { en: 'Ref / Slip #', bn: 'রেফারেন্স / স্লিপ নং' },
  'Aib Remarks / Note': { en: 'Remarks / Note', bn: 'মন্তব্য / নোট' },
  'No Aib transactions found in this view': {
    en: 'No Aib transactions found in this view',
    bn: 'এই ভিউতে কোনো গোরাবাত তহবিল লেনদেন পাওয়া যায়নি',
  },
  'Records are loaded directly from Firebase Firestore.': {
    en: 'Records are loaded directly from Firebase Firestore.',
    bn: 'রেকর্ডগুলো সরাসরি ফায়ারস্টোর ডাটাবেজ থেকে লোড করা হয়েছে।',
  },
  'Add ledger entry into the Aib endowment account': {
    en: 'Add ledger entry into the Aib endowment account',
    bn: 'গোরাবাত ওয়াকফ একাউন্টে লেনদেন রেকর্ড করুন',
  },
  'Brief summary of transaction details...': {
    en: 'Brief summary of transaction details...',
    bn: 'লেনদেনের সংক্ষিপ্ত বিবরণ দিন...',
  },
  'Save Entry': { en: 'Save Entry', bn: 'এন্ট্রি সংরক্ষণ করুন' },
  'Edit Aib Transaction': { en: 'Edit Aib Transaction', bn: 'গোরাবাত তহবিল লেনদেন সম্পাদনা' },
  'Update transaction specifications in Firestore': {
    en: 'Update transaction specifications in Firestore',
    bn: 'ডাটাবেজে লেনদেনের তথ্য পরিবর্তন করুন',
  },
  'Saving Changes...': { en: 'Saving Changes...', bn: 'পরিবর্তন সংরক্ষণ হচ্ছে...' },
  'Delete Transaction Entry': { en: 'Delete Transaction Entry', bn: 'লেনদেন মুছে ফেলুন' },
  'Confirm complete removal of this record from Cloud Firestore': {
    en: 'Confirm complete removal of this record from Cloud Firestore',
    bn: 'ফায়ারস্টোর থেকে এই রেকর্ড সম্পূর্ণ মুছে ফেলার নিশ্চিতকরণ',
  },
  'Warning: Irreversible Action': { en: 'Warning: Irreversible Action', bn: 'সতর্কতা: অপরিবর্তনীয় পদক্ষেপ' },
  'No, Keep Record': { en: 'No, Keep Record', bn: 'না, রেকর্ড রাখুন' },
  'Yes, Delete Record': { en: 'Yes, Delete Record', bn: 'হ্যাঁ, রেকর্ড মুছুন' },
  'Date is required.': { en: 'Date is required.', bn: 'তারিখ আবশ্যক।' },
  'Category is required.': { en: 'Category is required.', bn: 'খাত / ক্যাটাগরি আবশ্যক।' },
  'Amount must be greater than 0.': { en: 'Amount must be greater than 0.', bn: 'পরিমাণ ০ এর বেশি হতে হবে।' },
  'Description is required.': { en: 'Description is required.', bn: 'বিবরণ আবশ্যক।' },
  'Transaction updated successfully': { en: 'Transaction updated successfully', bn: 'লেনদেন সফলভাবে আপডেট হয়েছে' },
  'Transaction deleted successfully': { en: 'Transaction deleted successfully', bn: 'লেনদেন সফলভাবে মুছে ফেলা হয়েছে' },

  // Revolving Fund (ঘুরাবা তহবিল)
  'Disbursements of zero-interest welfare loans and revolving grants': {
    en: 'Disbursements of zero-interest welfare loans and revolving grants',
    bn: 'সুদমুক্ত কল্যাণ করজ ও ঘুরাবা তহবিল বিতরণ',
  },
  'Inflows and repayment settlements of previously issued revolving loans': {
    en: 'Inflows and repayment settlements of previously issued revolving loans',
    bn: 'বিতরণকৃত করজের ফেরত প্রাপ্তি ও সমন্বয়',
  },
  'Live ledger position of community reserve fund and circulating liquidity': {
    en: 'Live ledger position of community reserve fund and circulating liquidity',
    bn: 'ঘুরাবা তহবিল ও চলমান তারল্যের হিসাব পর্যালোচনা',
  },
  'Complete financial journal of all collections, loans, and returns': {
    en: 'Complete financial journal of all collections, loans, and returns',
    bn: 'সকল সংগ্রহ, বিতরণ ও ফেরতের আর্থিক খতিয়ান',
  },
  'Self-replenishing community fund distributions & returns': {
    en: 'Self-replenishing community fund distributions & returns',
    bn: 'ঘুরাবা তহবিল সংগ্রহ, করজ বিতরণ এবং ফেরত রেজিস্ট্রি',
  },
  'Total Inflow / Capital': { en: 'Total Inflow / Capital', bn: 'মোট মূলধন / সংগ্রহ' },
  'Circulating Loans': { en: 'Circulating Loans', bn: 'চলমান বিতরণকৃত করজ' },
  'Total Loans Disbursed': { en: 'Total Loans Disbursed', bn: 'মোট বিতরণকৃত করজ' },
  'Settled / Repaid': { en: 'Settled / Repaid', bn: 'মোট পরিশোধ / ফেরত' },
  'Available Fund Cash': { en: 'Available Fund Cash', bn: 'মওজুদ নগদ তহবিল' },
  'Unreturned Receivables': { en: 'Unreturned Receivables', bn: 'অপরিশোধিত পাওনা' },
  'Total Collected': { en: 'Total Collected', bn: 'মোট সংগৃহীত' },
  'Fund Net Available Balance': { en: 'Net Available Balance', bn: 'মোট অবশিষ্ট ব্যালেন্স' },
  'Active Outflow': { en: 'Active Outflow', bn: 'সক্রিয় বিতরণ' },
  'Settled Returns': { en: 'Settled Returns', bn: 'পরিশোধিত ফেরত' },
  'Fund Reconciliation Statement': { en: 'Fund Reconciliation Statement', bn: 'তহবিল সমন্বয় বিবরণী' },
  'Recipient / Contributor Name': { en: 'Recipient / Contributor Name', bn: 'গ্রহীতা / দাতার নাম' },
  'Recipient / Contributor': { en: 'Recipient / Contributor', bn: 'গ্রহীতা / দাতা' },
  'Person Name / Recipient': { en: 'Person Name / Recipient', bn: 'গ্রহীতা / ব্যক্তির নাম' },
  'Fund Entry Type': { en: 'Fund Entry Type', bn: 'তহবিল এন্ট্রির ধরণ' },
  'Voucher / Slip Reference': { en: 'Voucher / Slip Reference', bn: 'ভাউচার / স্লিপ রেফারেন্স' },
  'Record Revolving Fund Entry': { en: 'Record Revolving Fund Entry', bn: 'ঘুরাবা তহবিল লেনদেন রেকর্ড' },
  'Edit Fund Transaction': { en: 'Edit Fund Transaction', bn: 'তহবিল লেনদেন সম্পাদনা' },
  'Delete Fund Transaction': { en: 'Delete Fund Transaction', bn: 'তহবিল লেনদেন মুছে ফেলুন' },
  'Save Fund Entry': { en: 'Save Fund Entry', bn: 'তহবিল এন্ট্রি সংরক্ষণ করুন' },
  'Revolving Fund Solvent Accounting Formula': { en: 'Revolving Fund Solvent Accounting Formula', bn: 'ঘুরাবা তহবিল সচ্ছল হিসাব সমীকরণ' },
  'Completed Collections': { en: 'Completed Collections', bn: 'সম্পন্ন সংগ্রহসমূহ' },
  'Completed Returns': { en: 'Completed Returns', bn: 'সম্পন্ন ফেরতসমূহ' },
  'Completed Distributions': { en: 'Completed Distributions', bn: 'সম্পন্ন বিতরণসমূহ' },
  'Net Solvency Pool': { en: 'Net Solvency Pool', bn: 'নিট সচ্ছল তহবিল' },
  'Capital pooled from contributors': { en: 'Capital pooled from contributors', bn: 'দাতাদের কাছ থেকে সংগৃহীত মূলধন' },
  'Active welfare disbursements out': { en: 'Active welfare disbursements out', bn: 'সক্রিয় কল্যাণমূলক বিতরণ' },
  'Advances repaid back to pool': { en: 'Advances repaid back to pool', bn: 'তহবিলে পরিশোধিত অগ্রিম' },
  'Net solvent liquid pool': { en: 'Net solvent liquid pool', bn: 'নিট সচ্ছল তরল তহবিল' },
  'Post interest-free support to the revolving capital ledger': { en: 'Post interest-free support to the revolving capital ledger', bn: 'ঘুরাবা তহবিলের মূলধন লেজারে সুদমুক্ত সহায়তা পোস্ট করুন' },
  'Update record specifications in Firestore': { en: 'Update record specifications in Firestore', bn: 'ফায়ারস্টোরে রেকর্ড বিবরণ আপডেট করুন' },
  'Recipient or contributor name is required.': {
    en: 'Recipient or contributor name is required.',
    bn: 'গ্রহীতা বা দাতার নাম আবশ্যক।',
  },

  // Boarding & Hostel
  'Registered boarding residents, room allocation, and supervisors': {
    en: 'Registered boarding residents, room allocation, and supervisors',
    bn: 'নিবন্ধিত আবাসিক ছাত্র, কক্ষ বরাদ্দ ও তত্ত্বাবধায়ক',
  },
  'Monthly boarding seat rent, mess charges, and food utility collections': {
    en: 'Monthly boarding seat rent, mess charges, and food utility collections',
    bn: 'মাসিক সিট ভাড়া, মেস চার্জ ও খাবার ফি আদায়',
  },
  'Mess ration purchases, raw food supplies, vegetables, meat and cooking gas': {
    en: 'Mess ration purchases, raw food supplies, vegetables, meat and cooking gas',
    bn: 'মেসের রেশন ক্রয়, বাজার খরচ, গ্যাস ও খাবার সামগ্রী',
  },
  'Hostel electricity, water supply, cleaning, repairs and boarding upkeep': {
    en: 'Hostel electricity, water supply, cleaning, repairs and boarding upkeep',
    bn: 'ছাত্রাবাসের বিদ্যুৎ, পানি, পরিষ্কার ও মেরামত খরচ',
  },
  'Net financial standing, resident meal summaries, and boarding balances': {
    en: 'Net financial standing, resident meal summaries, and boarding balances',
    bn: 'বোর্ডিংয়ের আর্থিক বিবরণী ও চূড়ান্ত ব্যালেন্স',
  },
  'Residential lodging, meal subscriptions, and hostel operations': {
    en: 'Residential lodging, meal subscriptions, and hostel operations',
    bn: 'আবাসিক ছাত্রাবাস, খাবার ও আনুষঙ্গিক কার্যক্রম',
  },
  'Resident Students': { en: 'Resident Students', bn: 'আবাসিক শিক্ষার্থী' },
  'Currently housed in hostel': { en: 'Currently housed in hostel', bn: 'ছাত্রাবাসে অবস্থানরত' },
  'Total Boarding Fees': { en: 'Total Boarding Fees', bn: 'মোট বোর্ডিং ফি' },
  'Collected fees from residents': { en: 'Collected fees from residents', bn: 'আবাসিকদের কাছ থেকে আদায়কৃত' },
  'Total Food Expense': { en: 'Total Food Expense', bn: 'মোট খাবার খরচ' },
  'Cumulative mess groceries & ration': { en: 'Cumulative mess groceries & ration', bn: 'মেস ও রেশনের মোট খরচ' },
  'Hostel Maintenance': { en: 'Hostel Maintenance', bn: 'ছাত্রাবাস রক্ষণাবেক্ষণ' },
  'Utilities, repairs & supplies': { en: 'Utilities, repairs & supplies', bn: 'বিদ্যুৎ, পানি ও মেরামত' },
  'Net Boarding Balance': { en: 'Net Boarding Balance', bn: 'বোর্ডিং নিট উদ্বৃত্ত' },
  'Fees collected minus all expenses': { en: 'Fees collected minus all expenses', bn: 'আদায় থেকে সকল খরচের উদ্বৃত্ত' },
  'Assign Student to Boarding': { en: 'Assign Student to Boarding', bn: 'বোর্ডিংয়ে শিক্ষার্থী বরাদ্দ' },
  'Record Hostel Fee': { en: 'Record Hostel Fee', bn: 'ছাত্রাবাস ফি আদায়' },
  'Select Boarding Student': { en: 'Select Boarding Student', bn: 'বোর্ডিং শিক্ষার্থী নির্বাচন' },
  'Room Allocation': { en: 'Room Allocation', bn: 'কক্ষ বরাদ্দ' },
  'Bed / Seat Number': { en: 'Bed / Seat Number', bn: 'বেড / সিট নম্বর' },
  'Hostel Supervisor / Ustadh': { en: 'Hostel Supervisor / Ustadh', bn: 'ছাত্রাবাস তত্ত্বাবধায়ক / উস্তাদ' },
  'Monthly Boarding Fee': { en: 'Monthly Boarding Fee', bn: 'মাসিক বোর্ডিং ফি' },
  'Food Fee': { en: 'Food Fee', bn: 'খাবার ফি' },
  'Other Boarding Fee': { en: 'Other Boarding Fee', bn: 'অন্যান্য বোর্ডিং ফি' },
  'Edit Resident Record': { en: 'Edit Resident Record', bn: 'আবাসিক ছাত্র তথ্য সম্পাদনা' },
  'Remove Student from Boarding': { en: 'Remove Student from Boarding', bn: 'বোর্ডিং থেকে ছাত্র অপসারণ' },
  'Are you sure you want to remove this student from hostel boarding?': {
    en: 'Are you sure you want to remove this student from hostel boarding?',
    bn: 'আপনি কি নিশ্চিত যে এই শিক্ষার্থীকে ছাত্রাবাস থেকে অব্যাহতি দিতে চান?',
  },

  // Central Accounts
  'Official registry of institutional income, revenue, and sponsorships': {
    en: 'Official registry of institutional income, revenue, and sponsorships',
    bn: 'প্রতিষ্ঠানের সকল প্রকার আয় ও অনুদানের রেজিস্ট্রি',
  },
  'Operating expenditures, salaries, bills, utilities and disbursements': {
    en: 'Operating expenditures, salaries, bills, utilities and disbursements',
    bn: 'পরিচালন ব্যয়, বেতন-ভাতা, বিল ও অন্যান্য খরচ',
  },
  'Master general ledger journal of all debit and credit postings': {
    en: 'Master general ledger journal of all debit and credit postings',
    bn: 'সকল ডেবিট ও ক্রেডিট লেনদেনের প্রধান খতিয়ান',
  },
  'Summary of cash in hand, bank accounts, and mobile wallets': {
    en: 'Summary of cash in hand, bank accounts, and mobile wallets',
    bn: 'হাতে নগদ, ব্যাংক জমা ও মোবাইল ব্যাংকিং হিসাব',
  },
  'Comprehensive financial management, vouchers, and cashbooks': {
    en: 'Comprehensive financial management, vouchers, and cashbooks',
    bn: 'প্রতিষ্ঠানের সমন্বিত হিসাব, ভাউচার ও ক্যাশ বুক',
  },
  'General Total Income': { en: 'Total General Income', bn: 'মোট সাধারণ আয়' },
  'General Total Expense': { en: 'Total General Expense', bn: 'মোট সাধারণ ব্যয়' },
  'General Net Operating Balance': { en: 'Net Operating Balance', bn: 'মোট পরিচালন উদ্বৃত্ত' },
  'Surplus operating balance': { en: 'Surplus operating balance', bn: 'নিট সঞ্চিতি উদ্বৃত্ত' },
  'Deficit balance': { en: 'Deficit balance', bn: 'ঘাটতি ব্যালেন্স' },
  'Cumulative income entries': { en: 'Cumulative income entries', bn: 'মোট আয়ের ভাউচার' },
  'Cumulative expense entries': { en: 'Cumulative expense entries', bn: 'মোট ব্যয়ের ভাউচার' },
  'Institutional Cash & Bank Reserves': { en: 'Institutional Cash & Bank Reserves', bn: 'নগদ ও ব্যাংক রিজার্ভ তহবিল' },
  'Total Liquid Capital': { en: 'Total Liquid Capital', bn: 'মোট তারল্য তহবিল' },
  'Search transactions...': { en: 'Search transactions...', bn: 'লেনদেন অনুসন্ধান করুন...' },
  'Edit Financial Voucher': { en: 'Edit Financial Voucher', bn: 'আর্থিক ভাউচার সম্পাদনা' },
  'Delete Financial Voucher': { en: 'Delete Financial Voucher', bn: 'আর্থিক ভাউচার মুছে ফেলুন' },
  'Are you sure you want to delete this financial voucher?': {
    en: 'Are you sure you want to delete this financial voucher?',
    bn: 'আপনি কি নিশ্চিত যে এই আর্থিক ভাউচারটি মুছে ফেলতে চান?',
  },
  'Save Voucher': { en: 'Save Voucher', bn: 'ভাউচার সংরক্ষণ করুন' },

  // Settings
  'Official Institution Name': { en: 'Official Institution Name', bn: 'মাদ্রাসার দাপ্তরিক নাম' },
  'Registration / Accreditation No': { en: 'Registration / Accreditation No', bn: 'রেজিস্ট্রেশন নম্বর' },
  'Principal / Mohtamim Name': { en: 'Principal / Mohtamim Name', bn: 'মুহতামিম / অধ্যক্ষের নাম' },
  'Primary Phone Number': { en: 'Primary Phone Number', bn: 'প্রধান ফোন নম্বর' },
  'Primary Email Address': { en: 'Primary Email Address', bn: 'প্রধান ইমেইল ঠিকানা' },
  'Physical Postal Address': { en: 'Physical Postal Address', bn: 'ডাক ও মাদ্রাসার ঠিকানা' },
  'Institutional Bank Name': { en: 'Institutional Bank Name', bn: 'প্রতিষ্ঠানের ব্যাংকের নাম' },
  'Bank Account No / IBAN': { en: 'Bank Account No / IBAN', bn: 'ব্যাংক হিসাব নম্বর' },
  'Bank Routing / Branch': { en: 'Bank Routing / Branch', bn: 'ব্যাংক শাখা / রাউটিং' },
  'Save Profile': { en: 'Save Profile', bn: 'প্রোফাইল সংরক্ষণ করুন' },
  'Create User Account': { en: 'Create User Account', bn: 'ব্যবহারকারী তৈরি করুন' },
  'Edit User Account': { en: 'Edit User Account', bn: 'ব্যবহারকারী তথ্য সম্পাদনা' },
  'Delete User Account': { en: 'Delete User Account', bn: 'ব্যবহারকারী মুছে ফেলুন' },
  'Are you sure you want to delete user': { en: 'Are you sure you want to delete user', bn: 'আপনি কি নিশ্চিত মুছে ফেলতে চান ব্যবহারকারী' },
  'User Role': { en: 'User Role', bn: 'ব্যবহারকারীর ভূমিকা' },
  'Super Admin': { en: 'Super Admin', bn: 'সুপার এডমিন' },
  'Admin': { en: 'Admin', bn: 'এডমিন' },
  'Accountant': { en: 'Accountant', bn: 'হিসাবরক্ষক' },
  'Staff': { en: 'Staff', bn: 'স্টাফ' },
  'Teacher': { en: 'Teacher', bn: 'শিক্ষক' },
  'Session Active': { en: 'Active Session', bn: 'সক্রিয় শিক্ষাবর্ষ' },
  'Current Term': { en: 'Current Term', bn: 'বর্তমান সেশন' },
  'Set as Active Academic Year': { en: 'Set as Active Academic Year', bn: 'সক্রিয় শিক্ষাবর্ষ হিসেবে নির্ধারণ' },
  'Delete Academic Year': { en: 'Delete Academic Year', bn: 'শিক্ষাবর্ষ মুছে ফেলুন' },
  'Are you sure you want to delete academic session': {
    en: 'Are you sure you want to delete academic session',
    bn: 'আপনি কি নিশ্চিত মুছে ফেলতে চান শিক্ষাবর্ষ',
  },
  'Official class catalog and assigned class teachers': { en: 'Official class catalog and assigned class teachers', bn: 'অফিসিয়াল ক্লাস ক্যাটালগ এবং এসাইন ক্লাস টিচার' },
  'Add Academic Class': { en: 'Add Academic Class', bn: 'একাডেমিক ক্লাস যোগ করুন' },
  'Define a new curriculum level': { en: 'Define a new curriculum level', bn: 'নতুন পাঠ্যক্রম স্তর নির্ধারণ করুন' },
  'Class Name': { en: 'Class Name', bn: 'ক্লাস নেম' },
  'Standard Monthly Fee (৳)': { en: 'Standard Monthly Fee (৳)', bn: 'স্ট্যান্ডার্ড মান্থ ফি (৳)' },
  'Allowed Sections (Comma separated)': { en: 'Allowed Sections (Comma separated)', bn: 'অনুমোদিত সেকশন (কমা দিয়ে পৃথক)' },
  'Create Class': { en: 'Create Class', bn: 'ক্লাস তৈরি করুন' },
  'Edit Academic Class': { en: 'Edit Academic Class', bn: 'শ্রেণী তথ্য সম্পাদনা' },
  'Delete Academic Class': { en: 'Delete Academic Class', bn: 'শ্রেণী মুছে ফেলুন' },
  'Are you sure you want to delete class': { en: 'Are you sure you want to delete class', bn: 'আপনি কি নিশ্চিত মুছে ফেলতে চান শ্রেণী' },
  'Account Head Name': { en: 'Account Head Name', bn: 'হিসাব খাতের নাম' },
  'Head Type': { en: 'Head Type', bn: 'খাতের ধরণ' },
  'Donation': { en: 'Donation', bn: 'অনুদান' },
  'Admission Income': { en: 'Admission Income', bn: 'ভর্তি আয়' },
  'Tuition Income': { en: 'Tuition Income', bn: 'টিউশন ফি আয়' },
  'Service Income': { en: 'Service Income', bn: 'সেবা আয়' },
  'Other Income': { en: 'Other Income', bn: 'অন্যান্য আয়' },
  'Others Income': { en: 'Others Income', bn: 'অন্যান্য আয়' },
  'Salary': { en: 'Salary', bn: 'বেতন' },
  'Office Expense': { en: 'Office Expense', bn: 'অফিস খরচ' },
  'Electricity': { en: 'Electricity', bn: 'বিদ্যুৎ বিল' },
  'Water': { en: 'Water', bn: 'পানি বিল' },
  'Internet': { en: 'Internet', bn: 'ইন্টারনেট বিল' },
  'Maintenance': { en: 'Maintenance', bn: 'রক্ষণাবেক্ষণ' },
  'Stationery': { en: 'Stationery', bn: 'স্টেশনারি ও মনিহারী' },
  'Transport': { en: 'Transport', bn: 'যাতায়াত খরচ' },
  'Other Expense': { en: 'Other Expense', bn: 'অন্যান্য ব্যয়' },
  'Edit Account Category': { en: 'Edit Account Category', bn: 'হিসাব শ্রেণী সম্পাদনা' },
  'Delete Account Category': { en: 'Delete Account Category', bn: 'হিসাব শ্রেণী মুছে ফেলুন' },
  'Are you sure you want to delete category': {
    en: 'Are you sure you want to delete category',
    bn: 'আপনি কি নিশ্চিত হিসাব শ্রেণী মুছে ফেলতে চান',
  },
  'Are you sure you want to delete account head': {
    en: 'Are you sure you want to delete account head',
    bn: 'আপনি কি নিশ্চিত মুছে ফেলতে চান হিসাব খাত',
  },
  'Reset Website Data Option': { en: 'Reset Website Data', bn: 'ওয়েবসাইট ডাটা রিসেট' },
  'System Restart': { en: 'System Restart', bn: 'সিস্টেম রিস্টার্ট' },
  'Restart Server': { en: 'Restart Server', bn: 'সার্ভার রিস্টার্ট করুন' },
  'Reset Database': { en: 'Reset Database', bn: 'ডাটাবেজ রিসেট করুন' },
  'This will clear local cache and restore standard starter demo data. Real Firestore records will be re-synchronized.': {
    en: 'This will clear local cache and restore standard starter demo data. Real Firestore records will be re-synchronized.',
    bn: 'এটি স্থানীয় ক্যাশ পরিষ্কার করে প্রাথমিক ডেমো তথ্য পুনঃস্থাপন করবে। ফায়ারস্টোর ডাটাবেজ পুনঃসিঙ্ক হবে।',
  },
  'Are you sure you want to restart the system process? This will reinitialize local state and re-verify connections.': {
    en: 'Are you sure you want to restart the system process? This will reinitialize local state and re-verify connections.',
    bn: 'আপনি কি নিশ্চিত সিস্টেম রিস্টার্ট করতে চান? এটি সংযোগ ও লোকাল মেমোরি পুনরায় প্রস্তুত করবে।',
  },
  'Rebooting...': { en: 'Rebooting...', bn: 'রিস্টার্ট হচ্ছে...' },
  'Resetting...': { en: 'Resetting...', bn: 'রিসেট হচ্ছে...' },
  'Log Out of Console': { en: 'Log Out of Console', bn: 'লগআউট করুন' },
  'Are you sure you want to sign out of the Madrasa Office Console?': {
    en: 'Are you sure you want to sign out of the Madrasa Office Console?',
    bn: 'আপনি কি নিশ্চিত যে মাদ্রাসা অফিস কনসোল থেকে প্রস্থান (লগআউট) করতে চান?',
  },
  'Sign Out Now': { en: 'Sign Out Now', bn: 'এখনই লগআউট করুন' },
  'Cancel Action': { en: 'Cancel Action', bn: 'বাতিল করুন' },
};

/**
 * Normalizes text lookup keys so slight variations in casing or punctuation match seamlessly.
 */
export const translateText = (key: string, lang: Language): string => {
  if (!key) return '';
  if (lang === 'en') {
    const direct = translations[key];
    if (direct?.en) return direct.en;
    return key;
  }

  // Bengali lookup:
  // 1. Direct match
  if (translations[key]?.bn) {
    return translations[key].bn;
  }

  // 2. Trimmed match
  const trimmed = key.trim();
  if (translations[trimmed]?.bn) {
    return translations[trimmed].bn;
  }

  // 3. Trailing colon/ellipsis removal match
  const stripped = trimmed.replace(/[:.!?…]+$/, '').trim();
  if (translations[stripped]?.bn) {
    const bnVal = translations[stripped].bn;
    if (trimmed.endsWith(':')) return `${bnVal}:`;
    if (trimmed.endsWith('...')) return `${bnVal}...`;
    return bnVal;
  }

  // 4. Case-insensitive key match
  const lower = trimmed.toLowerCase();
  for (const [dictKey, dictVal] of Object.entries(translations)) {
    if (dictKey.toLowerCase() === lower && dictVal.bn) {
      return dictVal.bn;
    }
  }

  // Fallback to key
  return key;
};
