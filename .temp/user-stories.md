Login Page UI Components:
📋 PRD Reference: Release 1 PRD v0.3 (Mini MVP)  

User Story:  

As a developer or researcher wanting to access the Developer Platform, I want to log in using multiple authentication methods,
So that I can access the platform using my preferred login credentials.

Acceptance Criteria:

Login Page Header:

Page displays the title "Login to Developer Platform"

Social Login Options:

Red button with Google logo labeled "تسجيل الدخول بجوجل" (Login with Google)

Dark button with GitHub logo labeled "تسجيل الدخول بجيت هب" (Login with GitHub)  

Email/Password Login Form:

Email input field with placeholder text "البريد الإلكتروني" (Email)

Password input field with placeholder text "كلمة المرور" (Password)

Blue login button labeled "تسجيل الدخول" (Login)

Registration Link:  

Text stating "ليس لديك حساب؟" (Don't have an account?)

Clickable "تسجيل" (Register) link for new user registration  

Registration Developer Profile Form:

What is your business model? Are going to make it paid? Which pricing model?

What is the size of your team?

Tell us more about yourself so that the publisher gets to know you more.

If the user chose to login using Github or Gmail he will be directed to another form to fulfill the information. ⇒ The only difference between this page and the signup page is that he will not be asked to enter his email.

When the user log in by gmail we should fetch his first and last name as prefilled data then we give him the chance to adjust or change them.

📋 Figma Resources:

Wireframe: Login Page Wireframe        

Design: Login Page Design      

Social Login Form: Social Login Profile Form

If the login by Github or Gmail is for the very first time the user has to go through the following form that asks him about his main information regarding the business type, mode, and team.



First-time Social Login Flow:
📋 PRD Reference: Release 1 PRD v0.3 (Mini MVP)

User Story: As a first-time social login user, 
I want to be redirected to a profile completion form 
so that I can provide additional required information.

Acceptance Criteria:

Detect first-time Google login users

Detect first-time GitHub login users

Redirect new social users to profile completion form

Pre-populate name fields from Google profile data

Allow editing of pre-populated Google data

Skip email field for social login users

Handle profile completion flow separately from regular signup

Technical Notes:

Check user existence in database after OAuth callback

Fetch user data from OAuth providers

Implement conditional routing based on user status

📋 Figma Resources:

Social Login Form: Social Login Profile Form

Login Page: Login Page Design



Sign Up Page UI Components
📋 PRD Reference: Release 1 PRD v0.3 (Mini MVP)

User Story:

As a new user wanting to access the Developer Platform,
I want to create an account by providing my personal and professional information,
So that I can register and gain access to the platform.

Acceptance Criteria:

Registration Page Header:

Page displays the title "إنشاء حساب" (Create Account)

Registration Form Fields:

First name

Second Name

"المسمى الوظيفي" (Title) input field with placeholder text "Software Engineer"

"رقم الهاتف"(Phone Number) input filed with placeholder text "0965000000000"

"عنوان البريد الإلكتروني" (Email Address) input field with placeholder text "you@example.com"

"كلمة المرور" (Password) input field with placeholder text "********"

Sign Up Action:

Blue button labeled "التسجيل" (Sign Up)

Login Redirect:

Text stating "هل لديك حساب بالفعل؟" (Already have an account?)

Clickable "تسجيل الدخول" (Log In) link for existing users

📋 Figma Resources:

Wireframe: Signup Page Wireframe

Design: Signup Page Design

Signup By Email

Sign in by Github or Gmail (Registration Form):

The first name and last name should prefilled by the login providers.



Post-Registration Profile Form UI
📋 PRD Reference: Release 1 PRD v0.3 (Mini MVP)

User Story:

As a community developer,
I need to show the community members and publisher some more details about myself,
So that they get to know me and about what I am doing, right after my registration.

Acceptance Criteria:

Make sure that the user fulfills this right after the registration.

Make sure that if the session has been dropped, when he login back again or revisit the website he should fill it before he start using the website, but at that time it has to be skippable.

Make sure that if he skipped it that it appears to him every now and then that he needs to fulfill his profile basic information so that he can have access to resources, by the time he starts to click on any of the resources cards at the store.

Project Information Section:

Question header: ما الذي تعمل عليه؟ أخبرنا عن مشروعك؟ (What are you working on? Tell us about your project?)

Text input field with placeholder: الإجابة على سؤال نوع نموذج الأعمال (Answer to the business model type question)

Project Link Section:

Label: أضف رابط المشروع إذا توفر (Add project link if available)

Text input field with placeholder: الإجابة على سؤال حجم الفريق؟ (Answer to the team size question?)

Personal Information Section:

Instruction text: أخبرنا المزيد عن نفسك وحجم فريقك حتى يتعرف عليك المجتمع بشكل أفضل (Tell us more about yourself and your team size so the community can get to know you better)

Large text area with placeholder: الإجابة على طلب التعريف بالذات (Answer to the self-introduction request)

Registration Completion:

Dark button labeled: التخزين والإستمرار (Save and Continue)

Form Layout:

All form elements are contained within a bordered container

Form fields are properly spaced and organized vertically

Text areas accommodate longer responses for detailed information

📋 Figma Resources:

Profile Form Design: User Profile Information Form



Profile Completion Enforcement
📋 PRD Reference: Release 1 PRD v0.3 (Mini MVP)

User Story: As a platform admin, 
I want to enforce profile completion 
so that users provide necessary information before accessing resources.

Acceptance Criteria:

Check profile completion status on every login

Show profile form for incomplete profiles (redirect from any page)

Make profile form skippable for returning users (not first-time)

Display profile completion reminders periodically

Block resource access for users with incomplete profiles

Show completion prompt when user tries to access resources

Allow navigation but restrict resource downloads

Track profile completion status in user records

Technical Notes:

Implement middleware/guard for route protection

Use session/local storage for reminder frequency

Create reusable profile completion check service

Handle edge cases (partial completions, data corruption)



Asset Store - Global Search Interface & Filters
📋 PRD Reference: Release 1 PRD v0.3 (Mini MVP)

User Story:

As a user searching for resources,
I want to use a global search functionality with Creative Commons license filtering,
So that I can find relevant resources with specific licensing requirements.

💡 Note: The search functionality is going to be global, but for now we are not going to include it in all pages until we design complex nav components and get consensus regarding it.

Acceptance Criteria:

Search Interface:

There is a global search bar labeled "البحث" (Search) at the top of the page

Resource Display:

Search results are displayed as resource cards

Each resource card contains exactly three pieces of information:

عنوان المصدر (Resource Title)

شرح مختصر (Brief Description)

الرخصة (License)

اسم الناشر (Publisher Name)

Category Filter Panel:

Make sure that the user can filter using various types of categories:

Translation.

Transliteration.

Quran Corpra.

Quran Audio.

Quran Illustration/Font.

License Filter Panel:

A Creative Commons license filter panel is available on the right side

The panel is titled "رخصة الموارد (CreativeCommons)" (Resource License - CreativeCommons)

The following license options are available with checkboxes:

مفتوح بالكامل (Fully Open) - with green indicator

CC0/ Public Domain - with checkbox

إسناد (Attribution) - with green indicator

CC BY - with checkbox

إسناد ومشاركة بالمثل (Attribution ShareAlike) - with yellow indicator

CC BY-SA - with checkbox

إسناد بلا اشتقاق (Attribution No Derivatives) - with yellow indicator

CC BY-ND - with checkbox

إسناد واستخدام غيرتجاري (Attribution Non-Commercial) - with yellow indicator

CC BY-NC - with checkbox

إسناد غيرتجاري، مشاركة بالمثل (Attribution Non-Commercial ShareAlike) - with red indicator

CC BY-NC-SA - with checkbox

إسناد غيرتجاري بلا اشتقاق (Attribution Non-Commercial No Derivatives) - with red indicator

CC BY-NC-ND - with checkbox

💡 Make sure that there is a pagination feature.

💡 Licenses are not actually licenses instead these are labels that is going to be assigned to the resources. Meaning that the licenses are labels only in the first release. Also we are going to have only one type among those in which if the used that one proper filter he will find all resources and if he used any other filter he will not find any.

📋 Figma Resources:

Store Before Login: Assets Store Before Login

Store After Login: Assets Store After Login



Asset Store Pagination
📋 PRD Reference: Release 1 PRD v0.3 (Mini MVP)

User Story: As a user browsing many resources, I want pagination functionality so that I can navigate through large result sets efficiently.

Acceptance Criteria:

Implement pagination for resource lists

Display page numbers and navigation arrows

Show current page and total pages

Handle large result sets efficiently (virtual scrolling for future)

Preserve filter/search state during pagination

Update URL with page parameters

Display items per page count

Handle edge cases (empty results, single page)

Technical Notes:

Implement server-side pagination

Optimize API calls for filtered results

Add loading states for page transitions

Handle pagination analytics



Asset Details Page
📋 PRD Reference: Release 1 PRD v0.3 (Mini MVP)

User Story:

As a community developer,
I want to review and explore resource details,
So that I can publish resources with complete information and metadata.

Acceptance Criteria:

Navigation Header:

Top navigation contains: الرئيسية (Main), الأكاديمية (Academy), المشروعات (Projects), التقارير (Reports), معرض الأصول والموارد (Assets and Resources Gallery)

User greeting displays "مرحباً محمد" (Welcome Mohammad) with "M" avatar

Red تسجيل الخروج (Logout) button

Notification bell icon

Breadcrumb Navigation:

Shows "العودة إلى قائمة الوارد والصول" (Return to Import and Assets List) with back arrow

Resource Form Fields:

اسم المصدر (الناشر) (Resource Name - Publisher) input field

أيقونة المصدر (Resource Icon) upload area

الناشر (Publisher) input field

معايير الاستخدام (Usage Standards) button

استعراض الرخصة (License Review) button

تحميل المصدر (Download Resource) button with download icon

النسخة الأصلية للمورد (Original Version of Resource) with back arrow

Content Description:

وصف مطول (Extended Description) large text area

Content Preview Section:

Header: لقطة من المحتوى (Content Screenshot)

Descriptive text: "كما هو مبين في اللقطة المرفقة مع النص الذي تمثل جانب من جوانب المحتوى التي سيتم الإطلاع عليه بالكامل داخل الملف بعد القيام بالحصول على صلاحية وصول تم تنزيله"

MAKE SURE THAT He can't see download buttons unless he was authenticated

📋 Figma Resources:

Wireframe: Resource Details Page Wireframe



Access Request Form Popup
📋 PRD Reference: Release 1 PRD v0.3 (Mini MVP)

User Story:

As a publisher of resources,
I want to receive detailed information about users requesting access to my resources,
So that I can know about the people who want to access my resource.

Acceptance Criteria:

Popup Trigger:

When a user clicks the تحميل المصدر (Download Resource) button, a popup form appears

Access Request Form Fields:

لماذا تريد الوصول إلى المورد؟ (Why do you want to access the resource?)

Field description: وصف الإجابة عن السؤال عن سبب طلب الوصول

Error indicator: خطأ

ما هي القيمة المضافة لما تعمل عليه؟ (What is the added value to what you are working on?)

Form Action:

الإستمرار (Continue) button to submit the access request

Information Transfer:

All provided information is sent to the publisher to give them details about who is using their resource

📋 Figma Resources:

Wireframe: Access Request Details Form Wireframe



Content & Utilization Standards Page
📋 PRD Reference: Release 1 PRD v0.3 (Mini MVP)

User Story:

As a community developer,
I want to access documentation that explains the standards for accessing content in files,
So that I can understand how to properly use the content according to industry introduced standards.

Acceptance Criteria:

Documentation Page Header:

Title: الوثائق: معايير الوصول إلى البيانات (Documents: Content Access Standards)

Subtitle: يوضح هذا المستند معايير الوصول إلى البيانات في الملفات. يرجى اتباع الإرشادات أدناه لكل فئة (This document explains standards for accessing content in files. Please follow the guidelines below for each category)

Verse Usage Standards Section:

Header: معايير استخدام الآية (Verse Usage Standards)

Description: للوصول إلى الآيات، اتبع المعايير التالية (To access verses, follow the following standards)

Guidelines:

استخدم تنسيق معرف الآية الصحيح (Use correct verse identifier format)

تأكد من فهرسة الآية بشكل صحيح (Ensure correct verse indexing)

تحقق من آخر التحديثات في قاعدة بيانات الآيات (Verify latest updates in verse database)

Example: مثال: للوصول إلى الآية 2: 255، استخدم getVerse('2:255') (Example: To access verse 2:255, use getVerse('2:255'))

Words Usage Standards Section:

Header: معايير استخدام الكلمات (Words Usage Standards)

Description: للوصول إلى الكلمات، التزم بما يلي (To access words, commit to the following)

Guidelines:

استخدم مفاتيح الكلمات المحددة (Use specified word keys)

تأكد من تحديث قائمة الكلمات (Ensure word list is updated)

الحفاظ على الاتساق في تنسيق الكلمات (Maintain consistency in word formatting)

Example: مثال: لاسترجاع كلمة "الله"، استخدم getWord("الله") (Example: To retrieve the word "الله", use getWord("الله"))

Tafsir Usage Standards Section:

Header: معايير استخدام تفسير (Tafsir Usage Standards)

Description: عند الوصول إلى تفسير، اتبع الإرشادات التالية (When accessing tafsir, follow the following guidelines)

Guidelines:

استخدم مرجع تفسير الصحيح (Use correct tafsir reference)

تأكد من دقة الترجمات (Ensure translation accuracy)

تحقق من وجود تفسيرات محدثة لتفسير (Verify existence of updated interpretations for tafsir)

Example: مثال: للوصول إلى تفسير للآية 2: 255، استخدم getTafsir ('2:255') (Example: To access tafsir for verse 2:255, use getTafsir ('2:255'))

Footer:

Copyright notice: © معايير البيانات لعام 2023، كل الحقوق محفوظة (© Content Standards for 2023, All rights reserved)

📋 Figma Resources:

Wireframe: Content and Utilization Standards Wireframe



Publisher Public Profile Page
📋 PRD Reference: Release 1 PRD v0.3 (Mini MVP)

User Story:

As a user browsing publisher's profile,
I want to view a publisher's profile and their published resources,
So that I can learn about the publisher and access their available resources.

💡 Please notice that there is no local search or pagination features in the publisher page particularly because firstly we don't have local search feature in the website so far, and secondly because our first assumption is that each publisher so far has only few resources.

Acceptance Criteria:

Navigation Header:

Top navigation contains: الرئيسية (Main), الأكاديمية (Academy), المشروعات (Projects), التقارير (Reports), معرض الأصول والموارد (Assets and Resources Gallery)

User greeting displays "مرحباً محمد" (Welcome Mohammad) with "M" avatar

Red تسجيل الخروج (Logout) button

Notification bell icon

Publisher Information Section:

اسم الناشر (Publisher Name) header

أيقونة الناشر (Publisher Icon) display area on the right

نبذة مختصرة ومعلومات عن الناشر - معلومات عن الناشر مختصرة (Brief summary and information about the publisher - brief information about the publisher)

Resource Display:

قائمة الموارد (Resources List) section header

Grid layout displaying resource cards (5 columns x 2 rows = 10 cards total)

Each resource card contains:

عنوان المصدر (Resource Title)

شرح مختصر (Brief Description)

الرخصة (License)

Category Filter Panel:

Make sure that the user can filter using various types of categories:

Translation.

Transliteration.

Quran Corpra.

Quran Audio.

Quran Illustration/Font.

License Filter Panel:

A Creative Commons license filter panel is available on the right side

The panel is titled "رخصة الموارد (CreativeCommons)" (Resource License - CreativeCommons)

The following license options are available with checkboxes:

مفتوح بالكامل (Fully Open) - with green indicator

CC0/ Public Domain - with checkbox

إسناد (Attribution) - with green indicator

CC BY - with checkbox

إسناد ومشاركة بالمثل (Attribution ShareAlike) - with yellow indicator

CC BY-SA - with checkbox

إسناد بلا اشتقاق (Attribution No Derivatives) - with yellow indicator

CC BY-ND - with checkbox

إسناد واستخدام غيرتجاري (Attribution Non-Commercial) - with yellow indicator

CC BY-NC - with checkbox

إسناد غيرتجاري، مشاركة بالمثل (Attribution Non-Commercial ShareAlike) - with red indicator

CC BY-NC-SA - with checkbox

إسناد غيرتجاري بلا اشتقاق (Attribution Non-Commercial No Derivatives) - with red indicator

CC BY-NC-ND - with checkbox

📋 Figma Resources:

Wireframe: Publisher's Public Profile Page Wireframe



License Details Page
📋 PRD Reference: Release 1 PRD v0.3 (Mini MVP)

User Story:

As a user accessing a resource, → Could be the publisher himself.
I want to view the complete license documentation for the resource,
So that I can understand all the terms and details that apply to the resource usage.

Acceptance Criteria:

License Page Header:

Title: الرخصة الخاصة بالمورد: إسم المورد (The License for the Resource: Resource Name)

Description: يوضح هذا المستند الرخصة الخاصة بالمورد والتي تشمل كل البنود والتفاصيل المذكورة أدناه (This document explains the license for the resource which includes all the terms and details mentioned below)

First Clause Section:

Header: البند الأول (First Clause)

Content includes:

صفة البند الأول (Description of the first clause)

الشرط والظروف (Terms and conditions)

الحدث والملابسات (Events and circumstances)

والفرق بين ذلك وذاك (And the difference between this and that)

وعليه يجب كذا وكذا والمخالف سيعتبر ع (And therefore this and that must be done and violators will be considered...)

Second Clause Section:

Header: البند الثاني (Second Clause)

Content includes:

صفة البند الثاني (Description of the second clause)

الشرط والظروف (Terms and conditions)

الحدث والملابسات (Events and circumstances)

والفرق بين ذلك وذاك (And the difference between this and that)

وعليه يجب كذا وكذا والمخالف سيعتبر عليه فعل كذا وكذا (And therefore this and that must be done and violators will be considered to have done this and that)

Third Clause Section:

Header: البند الثالث (Third Clause)

Content includes:

صفة البند الثالث (Description of the third clause)

الشرط والظروف (Terms and conditions)

الحدث والملابسات (Events and circumstances)

والفرق بين ذلك وذاك (And the difference between this and that)

وعليه يجب كذا وكذا والمخالف سيعتبر عليه فعل كذا وكذا بمقتضى كذا (And therefore this and that must be done and violators will be considered to have done this and that according to such and such)

Footer:

Copyright notice: © معايير البيانات لعام 2023، كل الحقوق محفوظة (© Data Standards for 2023, All rights reserved)

📋 Figma Resources:

Wireframe: Async License Details Page Wireframe



Global Navigation System
📋 PRD Reference: Release 1 PRD v0.3 (Mini MVP)

Dependency:

ITQ-108ITQ-105User Story:

As a user, 
I need a complete navigation system 
so that I can easily navigate through different sections of the platform.

Acceptance Criteria:

Unauthenticated State

Authenticated State

الرئيسية (Home)

الرئيسية (Home)

الناشرين (Publishers)

الناشرين (Publishers)

معايير المحتوى والتقنية (Content and Technical Standards)

معايير المحتوى والتقنية (Content and Technical Standards)

عن المشروع (About the Project)

عن المشروع (About the Project)

تسجيل الدخول (Log In)

مرحباً محمد (Hello, Mohammed)

User Name (User Avatar)

Implement the main navigation menu with the following items:

الرئيسية (Home)

الناشرين (Publishers)

معايير المحتوى والتقنية (Content and Technical Standards)

عن المشروع (About the Project)

Display different navigation states for authenticated vs. unauthenticated users:

Unauthenticated State: Show a "تسجيل الدخول" (Log In) button in a rounded rectangle.

Authenticated State:

Display a user greeting, e.g., "مرحباً محمد" (Hello, Mohammed).

Display a circular user avatar with the initial "M" (for Mohammed).

Show a red "تسجيل الخروج" (Log Out) button in a rounded rectangle.

Manage navigation active states to highlight the current page.

Handle navigation accessibility, including ARIA labels and keyboard navigation.

📋 Figma Resources:

Main Figma Board: Release 1 Figma Jam Board



