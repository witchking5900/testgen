// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Trash2, Upload, FileText, Shuffle, Copy, Check, RefreshCw, X, Info, List, RotateCcw, Grid, Printer, Scissors, Settings, Award, AlertCircle, BarChart, Activity, Globe, Slash, Hash, BookOpen } from 'lucide-react';

// --- TRANSLATION DICTIONARY ---
const TRANSLATIONS = {
  en: {
    // Navigation
    nav_generator: "Test Generator",
    nav_answersheet: "Answer Sheet",
    nav_grader: "MCQ Grader",
    lang_toggle: "ქართული",
    
    // Test Generator
    gen_title: "Test Generator",
    gen_subtitle: "Combine questions from multiple sources.",
    gen_bases: "Source Files (Bases)",
    gen_reset: "Reset",
    gen_add: "Add Base",
    gen_amount: "Amount of qs:",
    gen_empty: "Click '+ Add Base' to start adding questions.",
    gen_upload: "Upload File",
    gen_paste: "Paste Text",
    gen_rand_order: "Randomize Order",
    gen_rand_choices: "Randomize Choices",
    gen_numbering: "Show Numbering",
    gen_btn: "Generate Test",
    gen_final: "Final Test",
    gen_total: "Total Questions:",
    gen_copy: "Copy Text",
    gen_paste_title: "Paste Questions",
    gen_paste_desc: "Paste your questions below.",
    gen_cancel: "Cancel",
    gen_save: "Save Questions",
    
    // Answer Sheet
    sheet_title: "Answer Sheet Constructor",
    sheet_subtitle: "Auto-optimized for A4 paper efficiency.",
    sheet_total: "Total Questions",
    sheet_choices: "Choices per Q",
    sheet_q_cols: "Question Cols",
    sheet_page_grid: "Page Grid",
    sheet_fitting: "Fitting",
    sheet_tickets: "tickets",
    sheet_btn_copy: "Copy",
    sheet_btn_print: "Print",
    sheet_student: "Student:",
    sheet_group: "Group:",
    sheet_ans: "answer",
    sheet_recommended: "⭐ Rec.",
    sheet_font: "Font",
    
    // Grader & Analytics
    grad_title: "MCQ Grader & Analytics",
    grad_subtitle: "Multi-version grading and item difficulty analysis.",
    grad_neg_marking: "Negative Marking",
    grad_penalty: "Penalty per wrong answer:",
    grad_report_btn: "View Statistical Report",
    grad_step1: "1. Answer Keys (Multi-Version)",
    grad_step2: "2. Student Responses",
    grad_step3: "3. Grading Results",
    grad_clear: "Clear",
    grad_empty_keys: "Enter at least one answer key to start grading.",
    grad_empty_stud: "Enter student results to see grades.",
    grad_perfect: "Perfect Score",
    grad_wrong: "Wrong:",
    grad_students: "Students",
    grad_avg: "Avg Score",
    grad_best: "Highest",
    
    // Report
    rep_title: "Statistical Analysis Report",
    rep_back: "Back to Grader",
    rep_print: "Print Report",
    rep_version: "Test Version:",
    rep_q: "Q#",
    rep_ans: "Correct Ans",
    rep_rate: "Difficulty (Success %)",
    rep_disc: "Discrimination (D)",
    rep_de: "Distractor Eff.",
    rep_analysis: "Action Matrix Verdict",
    rep_toxic: "Toxic Trap (D < 0) - PURGE",
    rep_elite: "Elite (Hard but Fair) - KEEP",
    rep_workhorse: "Workhorse (Good D) - KEEP",
    rep_freebie: "Freebie (Too Easy) - REVIEW",
    rep_std: "Standard / Marginal",
    rep_nodata: "Not enough data",
    rep_void_badge: "VOIDED - Excluded from stats",
    tooltip_void: "Voided: +1 Free Point",
    tooltip_skipped: "Skipped (No Penalty)",
    tooltip_exp: "Exp:",

    // Exam Vitals Categories
    cat_elite: "Elite",
    cat_workhorse: "Workhorse",
    cat_freebie: "Freebie",
    cat_toxic: "Toxic",
    cat_std: "Standard",
    rep_target_elite: "(rec. 15%-20%)",
    rep_target_workhorse: "(rec. ~70%)",
    rep_target_freebie: "(rec. 10%-15%)",
    rep_target_toxic: "(rec. 0%)",
    rep_target_std: "(minimize)",
    
    // Official User Guide (English)
    guide_title: "MCQ Grader & Analytics: Official User Guide",
    guide_intro: "Welcome to the Advanced MCQ Grader. This tool goes beyond simply calculating raw scores; it performs automated psychometric item analysis to determine the actual quality, fairness, and reliability of your exam questions. Below are the formatting rules and explanations of the statistical metrics used to grade your exams.",
    
    g1_title: "1. Data Entry Rules & Notation",
    g1_sub1: "Answer Keys Entry:",
    g1_format1: "Format: [Version Name] [Answer String] (e.g., A ABCDDCBA)",
    g1_v: "The 'V' Character (Voided Question): If a question was flawed, poorly printed, or you want to throw it out after the test was printed, type a V in the answer key instead of the correct letter.",
    g1_rule1: "Rule: A voided question automatically grants 1 free point to every student, regardless of what they answered. It is completely removed from the statistical analysis (Difficulty, Discrimination, etc.) so it does not skew your exam's health metrics.",
    g1_sub2: "Student Responses Entry:",
    g1_format2: "Format: [Student First & Last Name] [Version] [Answer String] (e.g., John Doe A ABCDDCBA)",
    g1_x: "The 'X' or '-' Character (Skipped Question): If a student leaves a question completely blank, enter an X or a hyphen (-).",
    g1_rule2: "Rule: A skipped question awards 0 points. However, if Negative Marking is turned on, skipped questions are mathematically protected and do not receive a penalty deduction.",

    g2_title: "2. Understanding the Psychometric Metrics",
    g2_intro: "Once graded, the system analyzes every question based on Classical Test Theory (CTT). Here is how to interpret the numbers:",
    g2_diff_title: "Difficulty Index (Success Rate)",
    g2_diff_what: "What it is: The percentage of the total class that answered the question correctly.",
    g2_diff_how: "How to read it:",
    g2_diff_1: "< 30%: Very hard.",
    g2_diff_2: "40% - 80%: The \"sweet spot\" for standard learning.",
    g2_diff_3: "> 80%: Very easy.",

    g2_disc_title: "Discrimination Index (D)",
    g2_disc_what: "What it is: A measure of how well a question separates your top-performing students from your lowest-performing students. The system divides the class into the Top 33% and the Bottom 33% and compares their success rates on that specific question.",
    g2_disc_how: "How to read it:",
    g2_disc_1: "Positive (+) Score (0.25 to 1.0): Excellent. It means your smartest students got it right, and the students who failed the exam got it wrong. The question is testing true knowledge.",
    g2_disc_2: "Zero (0.0): Neutral. Both top and bottom students answered it correctly at the same rate.",
    g2_disc_3: "Negative (-) Score: Danger. A negative score means your worst students are guessing it right, while your best students are getting it wrong. This usually indicates a poorly worded trick question or a mistake in the answer key.",

    g2_de_title: "Distractor Efficiency (DE)",
    g2_de_what: "What it is: In a multiple-choice question, the wrong answers are called \"distractors.\" DE measures the percentage of your wrong answers that were actually chosen by at least one student.",
    g2_de_why: "Why we need it: If you write a 4-choice question and one of the wrong options is so obviously incorrect that absolutely no one picks it, it is a \"dead\" option. Your 4-choice question has functionally become a 3-choice question, artificially raising the students' chances of guessing correctly.",
    g2_de_how: "How to read it:",
    g2_de_1: "100%: Perfect. Every wrong answer you wrote successfully tricked at least one unprepared student.",
    g2_de_2: "66% or 33%: One or more of your wrong answers are too obvious. You should rewrite the unused options to make them more challenging next semester.",
    g2_de_3: "0%: A total freebie. No one fell for any of your decoys.",
    g2_de_note: "Note on Skipped Questions: A 0% Success Rate does not guarantee a 100% DE. If a question is so intimidating that students choose to skip it entirely, your decoys may go unselected. A skipped question protects the student from a guessing penalty, but it lowers the Distractor Efficiency of the question.",

    g3_title: "3. Negative Marking (The Guessing Penalty)",
    g3_intro: "If enabled, the system actively punishes blind guessing by deducting fractional points for incorrect answers.",
    g3_why: "Why is the standard deduction 0.33?",
    g3_why_text: "Negative marking is designed to make the statistical \"Expected Value\" of a completely blind guess exactly zero. If a student takes a 4-option multiple-choice question, they have a 1-in-4 (25%) chance of guessing right, and a 3-in-4 (75%) chance of guessing wrong. To neutralize the 1 point they get for a lucky guess, the penalty for the 3 wrong guesses must perfectly balance it out.",
    g3_form: "The Formula: 1 / (Number of Options - 1)",
    g3_form_1: "For 4 Choices (A, B, C, D): 1 / (4 - 1) = 1/3 = 0.33 deduction.",
    g3_form_2: "For 5 Choices (A, B, C, D, E): 1 / (5 - 1) = 1/4 = 0.25 deduction.",
    g3_note: "Note: Skipped questions ('X' or '-') receive 0 points but are completely exempt from the negative marking penalty.",

    g4_title: "4. The Action Matrix Verdicts",
    g4_intro: "To save you time, the system processes the Difficulty and Discrimination indices together to give you an immediate, actionable verdict for every question:",
    g4_1: "Elite (Hard but Fair): Very low success rate, but highly positive discrimination. Keep it. It beautifully identifies your absolute best students. This should be 15% or 20% of entire test.",
    g4_2: "Workhorse (Good D): Balanced difficulty and strong positive discrimination. This is the backbone of a reliable exam. Keep it. This should be the core of a test, nearly 70%.",
    g4_3: "Freebie (Too Easy): Nearly everyone got it right. Freebies serve two crucial purposes. First, they break the ice and reduce acute test anxiety. Second, they test the absolute, fundamental 'do-not-kill-the-patient' baseline knowledge. Review it to ensure the distractors aren't too obvious. This should be 10% or 15%.",
    g4_4: "Toxic Trap (D < 0): Negative discrimination. Purge or drastically rewrite this question, as it is actively penalizing your most prepared students."
  },
  ka: {
    // Navigation
    nav_generator: "ტესტის გენერატორი",
    nav_answersheet: "პასუხების ფურცელი",
    nav_grader: "MCQ შემფასებელი",
    lang_toggle: "English",
    
    // Test Generator
    gen_title: "ტესტის გენერატორი",
    gen_subtitle: "შეაერთეთ კითხვები სხვადასხვა წყაროდან.",
    gen_bases: "წყაროს ფაილები (ბაზები)",
    gen_reset: "გასუფთავება",
    gen_add: "ბაზის დამატება",
    gen_amount: "კითხვების რ-ბა:",
    gen_empty: "დააჭირეთ '+ ბაზის დამატება'-ს კითხვების დასამატებლად.",
    gen_upload: "ფაილის ატვირთვა",
    gen_paste: "ტექსტის ჩასმა",
    gen_rand_order: "რიგითობის არევა",
    gen_rand_choices: "პასუხების არევა",
    gen_numbering: "ნუმერაცია",
    gen_btn: "ტესტის გენერირება",
    gen_final: "საბოლოო ტესტი",
    gen_total: "სულ კითხვა:",
    gen_copy: "ტექსტის კოპირება",
    gen_paste_title: "კითხვების ჩასმა",
    gen_paste_desc: "ჩასვით თქვენი კითხვები ქვემოთ.",
    gen_cancel: "გაუქმება",
    gen_save: "კითხვების შენახვა",
    
    // Answer Sheet
    sheet_title: "პასუხების ფურცლის კონსტრუქტორი",
    sheet_subtitle: "ავტომატურად ოპტიმიზირებული A4 ფორმატისთვის.",
    sheet_total: "სულ კითხვა",
    sheet_choices: "სავარაუდო პასუხი",
    sheet_q_cols: "სვეტების რ-ბა",
    sheet_page_grid: "გვერდის ბადე",
    sheet_fitting: "ეტევა",
    sheet_tickets: "ბილეთი",
    sheet_btn_copy: "კოპირება",
    sheet_btn_print: "ბეჭდვა",
    sheet_student: "სტუდენტი:",
    sheet_group: "ჯგუფი:",
    sheet_ans: "პასუხი",
    sheet_recommended: "⭐ რეკომენდ.",
    sheet_font: "შრიფტი",
    
    // Grader & Analytics
    grad_title: "MCQ შემფასებელი და ანალიტიკა",
    grad_subtitle: "მრავალ-ვერსიიანი შეფასება და სირთულის ანალიზი.",
    grad_neg_marking: "უარყოფითი შეფასება",
    grad_penalty: "ჯარიმა არასწორ პასუხზე:",
    grad_report_btn: "სტატისტიკური ანგარიშის ნახვა",
    grad_step1: "1. პასუხები",
    grad_step2: "2. სტუდენტების პასუხები",
    grad_step3: "3. შეფასების შედეგები",
    grad_clear: "გასუფთავება",
    grad_empty_keys: "შეიყვანეთ მინიმუმ ერთი ტრაფარეტი შესაფასებლად.",
    grad_empty_stud: "შეიყვანეთ სტუდენტების პასუხები შედეგების სანახავად.",
    grad_perfect: "უშეცდომო",
    grad_wrong: "არასწორი:",
    grad_students: "სტუდენტი",
    grad_avg: "საშ. ქულა",
    grad_best: "უმაღლესი",
    
    // Report
    rep_title: "სტატისტიკური ანალიზის ანგარიში",
    rep_back: "შემფასებელზე დაბრუნება",
    rep_print: "ანგარიშის ბეჭდვა",
    rep_version: "ტესტის ვერსია:",
    rep_q: "კ#",
    rep_ans: "სწორი პასუხი",
    rep_rate: "სირთულე (წარმატების %)",
    rep_disc: "დისკრიმინაცია (D)",
    rep_de: "დისტრაქტორის ეფექტ.",
    rep_analysis: "მატრიცის ვერდიქტი",
    rep_toxic: "ტოქსიკური ხაფანგი (D < 0) - ამოიღეთ",
    rep_elite: "ელიტური (რთული, მაგრამ სამართლიანი) - დატოვეთ",
    rep_workhorse: "სტაბილური (კარგი D) - დატოვეთ",
    rep_freebie: "მარტივი ქულა (ზედმეტად მარტივი) - გადახედეთ",
    rep_std: "სტანდარტული / ზღვრული",
    rep_nodata: "არასაკმარისი მონაცემი",
    rep_void_badge: "გაუქმებულია - სტატისტიკის გარეშე",
    tooltip_void: "გაუქმებულია: +1 უფასო ქულა",
    tooltip_skipped: "გამოტოვებულია (ჯარიმის გარეშე)",
    tooltip_exp: "სწორი:",

    // Exam Vitals Categories
    cat_elite: "ელიტური",
    cat_workhorse: "სტაბილური",
    cat_freebie: "მარტივი",
    cat_toxic: "ტოქსიკური",
    cat_std: "სტანდარტული",
    rep_target_elite: "(რეკ. 15%-20%)",
    rep_target_workhorse: "(რეკ. ~70%)",
    rep_target_freebie: "(რეკ. 10%-15%)",
    rep_target_toxic: "(რეკ. 0%)",
    rep_target_std: "(მინიმუმამდე)",

    // Official User Guide (Georgian)
    guide_title: "MCQ შემფასებელი და ანალიტიკა: ოფიციალური სახელმძღვანელო",
    guide_intro: "კეთილი იყოს თქვენი მობრძანება დახურული ტესტების (MCQ) გაფართოებულ შემფასებელში. ეს ინსტრუმენტი არა მხოლოდ ითვლის ნედლ ქულებს, არამედ აკეთებს ავტომატიზებულ ფსიქომეტრიულ ანალიზს ტესტის კითხვების ხარისხის, სამართლიანობისა და საიმედოობის დასადგენად. ქვემოთ მოცემულია მონაცემთა შეყვანის წესები და შეფასებისთვის გამოყენებული სტატისტიკური მეტრიკების განმარტებები.",
    
    g1_title: "1. მონაცემთა შეყვანის წესები და აღნიშვნები",
    g1_sub1: "პასუხები (Answer Keys):",
    g1_format1: "ფორმატი: [ვერსიის სახელი] [პასუხები] (მაგ., A ABCDDCBA)",
    g1_v: "სიმბოლო 'V' (გაუქმებული კითხვა): თუ კითხვა იყო ხარვეზიანი, ცუდად დაბეჭდილი, ან გსურთ მისი ამოღება, სწორი პასუხის ნაცვლად ჩაწერეთ V.",
    g1_rule1: "წესი: გაუქმებული კითხვა ავტომატურად ანიჭებს 1 ქულას ყველა სტუდენტს, მიუხედავად მათი პასუხისა. ის სრულად ამოღებულია სტატისტიკური ანალიზიდან (სირთულე, დისკრიმინაცია), რათა არ იქონიოს გავლენა გამოცდის მეტრიკებზე.",
    g1_sub2: "სტუდენტების პასუხები:",
    g1_format2: "ფორმატი: [სახელი და გვარი] [ვერსია] [პასუხები] (მაგ., John Doe A ABCDDCBA)",
    g1_x: "სიმბოლო 'X' ან '-' (გამოტოვებული კითხვა): თუ სტუდენტმა კითხვა სრულად გამოტოვა, ჩაწერეთ X ან ტირე (-).",
    g1_rule2: "წესი: გამოტოვებული კითხვა ფასდება 0 ქულით. თუმცა, თუ უარყოფითი შეფასება (Negative Marking) ჩართულია, გამოტოვებული კითხვები დაცულია და მათზე ჯარიმა არ მოქმედებს.",

    g2_title: "2. ფსიქომეტრიული მეტრიკების განმარტება",
    g2_intro: "შეფასების შემდეგ, სისტემა აანალიზებს კითხვებს კლასიკური ტესტის თეორიის (CTT) საფუძველზე. როგორ გავაანალიზოთ მიღებული მონაცემები:",
    g2_diff_title: "სირთულის ინდექსი (წარმატების %)",
    g2_diff_what: "რა არის ეს: სტუდენტების ის პროცენტული რაოდენობა, რომლებმაც კითხვას სწორად უპასუხეს.",
    g2_diff_how: "როგორ გავაანალიზოთ:",
    g2_diff_1: "< 30%: ძალიან რთული.",
    g2_diff_2: "40% - 80%: სტანდარტული \"ოქროს შუალედი\".",
    g2_diff_3: "> 80%: ძალიან მარტივი.",

    g2_disc_title: "დისკრიმინაციის ინდექსი (D)",
    g2_disc_what: "რა არის ეს: ზომავს რამდენად კარგად მიჯნავს კითხვა ტოპ სტუდენტებს ყველაზე სუსტი სტუდენტებისგან. სისტემა ყოფს კლასს საუკეთესო 33%-ად და ქვედა 33%-ად და ადარებს მათ წარმატების მაჩვენებელს კონკრეტულ კითხვაზე.",
    g2_disc_how: "როგორ გავაანალიზოთ:",
    g2_disc_1: "დადებითი (+) მაჩვენებელი (0.25 - 1.0): იდეალური. ნიშნავს, რომ ძლიერმა სტუდენტებმა სწორად უპასუხეს, ხოლო სუსტებმა - ვერა. კითხვა ზომავს ნამდვილ ცოდნას.",
    g2_disc_2: "ნული (0.0): ნეიტრალური. ორივე ჯგუფმა თანაბრად (კარგად ან ცუდად) უპასუხა ამ კითხვას.",
    g2_disc_3: "უარყოფითი (-) მაჩვენებელი: საფრთხე! ნიშნავს, რომ სუსტი სტუდენტები იცნობენ სწორ პასუხს, ძლიერები კი ცდებიან. ეს მიუთითებს ბუნდოვან/ეშმაკურ კითხვაზე ან შეცდომაზე პასუხების გასაღებში.",

    g2_de_title: "დისტრაქტორების ეფექტურობა (DE)",
    g2_de_what: "რა არის ეს: მრავალპასუხიან კითხვაში მცდარ პასუხებს ეწოდება \"დისტრაქტორები\". DE ზომავს მცდარი პასუხების იმ პროცენტს, რომელიც მინიმუმ 1-მა სტუდენტმა მაინც აირჩია.",
    g2_de_why: "რატომ გვჭირდება: თუ 4 პასუხიდან ერთ-ერთი იმდენად აბსურდულია, რომ მას არავინ ირჩევს, კითხვა რეალურად 3-პასუხიანი ხდება, რაც ხელოვნურად ზრდის ბრმად გამოცნობის შანსს.",
    g2_de_how: "როგორ გავაანალიზოთ:",
    g2_de_1: "100%: იდეალური. ყველა მცდარმა ვარიანტმა წარმატებით დააბნია მინიმუმ ერთი მოუმზადებელი სტუდენტი.",
    g2_de_2: "66% ან 33%: ერთი ან რამდენიმე პასუხი ზედმეტად თვალსაჩინოა. უნდა შეცვალოთ აურჩეველი ვარიანტები შემდეგი გამოცდისთვის, რათა კითხვა უფრო დამაფიქრებელი გახდეს.",
    g2_de_3: "0%: სრულიად უფასო ქულა. არცერთი სტუდენტი არ მოტყუვდა მცდარი ვარიანტებით.",
    g2_de_note: "შენიშვნა გამოტოვებულ კითხვებზე: წარმატების 0%-იანი მაჩვენებელი არ იძლევა DE-ს 100%-ის გარანტიას. თუ კითხვა იმდენად რთულია, რომ სტუდენტები მას ტოვებენ, დისტრაქტორებიც აურჩეველი რჩება. გამოტოვებული კითხვა იცავს სტუდენტს ჯარიმისგან, მაგრამ ამცირებს კითხვის DE-ს.",

    g3_title: "3. უარყოფითი შეფასება (Negative Marking)",
    g3_intro: "ჩართვის შემთხვევაში, სისტემა მიზანმიმართულად აჯარიმებს სტუდენტს ბრმად გამოცნობის მცდელობისთვის და აკლებს ქულას არასწორ პასუხზე.",
    g3_why: "რატომ არის სტანდარტული ჯარიმა 0.33?",
    g3_why_text: "უარყოფითი შეფასების მიზანია ბრმად გამოცნობის სტატისტიკური ალბათობა (Expected Value) გაუტოლდეს ნულს. 4-პასუხიან კითხვაში გამოცნობის შანსი 1/4-ია (25%), შეცდომის კი 3/4 (75%). 1 იღბლიანი გამოცნობით მიღებული ქულის გასანეიტრალებლად, 3-მა არასწორმა პასუხმა ჯამში უნდა გამოაკლოს 1 ქულა, რათა ბალანსი დაცული იყოს.",
    g3_form: "ფორმულა: 1 / (სავარაუდო პასუხების რაოდენობას - 1)",
    g3_form_1: "4 პასუხისას (A, B, C, D): 1 / (4 - 1) = 1/3 = 0.33 ჯარიმა.",
    g3_form_2: "5 პასუხისას (A, B, C, D, E): 1 / (5 - 1) = 1/4 = 0.25 ჯარიმა.",
    g3_note: "შენიშვნა: გამოტოვებული კითხვები ('X' ან '-') ფასდება 0 ქულით და სრულად თავისუფლდება უარყოფითი შეფასების ჯარიმისგან.",

    g4_title: "4. მატრიცის ვერდიქტი (Action Matrix)",
    g4_intro: "დროის დასაზოგად, სისტემა ერთდროულად აანალიზებს სირთულესა და დისკრიმინაციას და გაძლევთ მზა, სამოქმედო ვერდიქტს თითოეულ კითხვაზე:",
    g4_1: "ელიტური (Elite - რთული, მაგრამ სამართლიანი): ძალიან დაბალი წარმატების %, მაგრამ მაღალი დადებითი დისკრიმინაცია. დატოვეთ. იდეალურად ავლენს თქვენს საუკეთესო სტუდენტებს. სასურველია შეადგენდეს ტესტის 15%-20%-ს.",
    g4_2: "სტაბილური (Workhorse - კარგი D): ბალანსირებული სირთულე და ძლიერი დადებითი დისკრიმინაცია. საიმედო გამოცდის ხერხემალია. დატოვეთ. სასურველია შეადგენდეს ტესტის ძირითად ბირთვს (დაახლოებით 70%).",
    g4_3: "მარტივი (Freebie - ზედმეტად მარტივი): თითქმის ყველამ უპასუხა. მარტივ კითხვებს აქვს ორი მნიშვნელოვანი დატვირთვა: პირველი - ამცირებს საგამოცდო სტრესს (ყინულის გატეხვა), მეორე - ამოწმებს კრიტიკულ, საბაზისო ცოდნას. გადახედეთ მცდარ პასუხებს, რათა დარწმუნდეთ, რომ ზედმეტად თვალსაჩინო არ არის. სასურველია შეადგენდეს 10%-15%-ს.",
    g4_4: "ტოქსიკური ხაფანგი (Toxic Trap - D < 0): უარყოფითი დისკრიმინაცია. ამოიღეთ ან ძირფესვიანად შეცვალეთ ეს კითხვა, რადგან ის პირდაპირ აზარალებს თქვენს კარგად მომზადებულ სტუდენტებს."
  }
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('generator');
  const [lang, setLang] = useState('ka');

  const t = (key) => TRANSLATIONS[lang][key] || key;

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-8 overflow-x-auto">
              <button onClick={() => setActiveTab('generator')} className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'generator' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <FileText className="w-4 h-4" /> {t('nav_generator')}
              </button>
              <button onClick={() => setActiveTab('answersheet')} className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'answersheet' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <Grid className="w-4 h-4" /> {t('nav_answersheet')}
              </button>
              <button onClick={() => setActiveTab('grader')} className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'grader' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <Award className="w-4 h-4" /> {t('nav_grader')}
              </button>
            </div>
            
            <button onClick={() => setLang(lang === 'en' ? 'ka' : 'en')} className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-600 transition-colors border border-transparent hover:border-gray-200">
              <Globe className="w-4 h-4" /> {t('lang_toggle')}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto print:p-0 print:m-0 print:w-full print:max-w-none">
        {activeTab === 'generator' && <TestGenerator t={t} />}
        {activeTab === 'answersheet' && <AnswerSheetConstructor t={t} />}
        {activeTab === 'grader' && <MCQGrader t={t} />}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT 1: TEST GENERATOR ---
function TestGenerator({ t }) {
  const [bases, setBases] = useState([{ id: 1, name: 'Base 1', content: [], count: 0, type: 'file' }, { id: 2, name: 'Base 2', content: [], count: 0, type: 'file' }]);
  const [generatedTest, setGeneratedTest] = useState([]);
  const [isRandomized, setIsRandomized] = useState(true);
  const [isChoiceRandomized, setIsChoiceRandomized] = useState(true);
  const [showNumbering, setShowNumbering] = useState(true);
  const [showPasteModal, setShowPasteModal] = useState(null);
  const [pasteText, setPasteText] = useState('');

  useEffect(() => {
    if (!window.mammoth) {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const resetApp = () => {
    if (window.confirm("Are you sure you want to clear all data and start over?")) {
      setBases([{ id: 1, name: 'Base 1', content: [], count: 0, type: 'file' }, { id: 2, name: 'Base 2', content: [], count: 0, type: 'file' }]);
      setGeneratedTest([]);
      setIsRandomized(true);
      setIsChoiceRandomized(true);
      setShowNumbering(true);
    }
  };

  const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const parseQuestions = (text) => {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const questions = [];
    let currentBlock = [];
    let currentBlockType = 'standard';

    const saveBlock = (block, type) => {
      let content = block.filter(line => line.trim() !== '').join('\n').trim();
      if (type === 'standard') content = content.replace(/([^\n])\s+([A-Ea-e][\.\)]\s)/g, '$1\n$2');
      return content;
    };

    lines.forEach(line => {
      const trimmed = line.trim();
      const isNumStart = /^\s*\d+[\.\)]/.test(line);
      const isSlashStart = trimmed.startsWith('////');

      if (isNumStart || isSlashStart) {
        if (currentBlock.length > 0) questions.push(saveBlock(currentBlock, currentBlockType));
        if (isSlashStart) {
          currentBlockType = 'slash';
          currentBlock = [trimmed]; 
        } else {
          currentBlockType = 'standard';
          const cleanLine = line.replace(/^\s*\d+[\.\)]\s*/, '');
          currentBlock = [cleanLine];
        }
      } else {
        if (currentBlock.length > 0) {
          if (currentBlockType === 'slash') currentBlock.push(line);
          else {
             let processedLine = line;
             if (trimmed.startsWith('///')) processedLine = line.replace(/^\s*\/\/\/\s*/, 'choice. '); 
             else if (trimmed.startsWith('//')) processedLine = line.replace(/^\s*\/\/\s*/, 'choice. ') + ' *';
             currentBlock.push(processedLine);
          }
        }
      }
    });

    if (currentBlock.length > 0) questions.push(saveBlock(currentBlock, currentBlockType));
    return questions;
  };

  const processTextContent = (text, fileName, id) => {
    const questions = parseQuestions(text);
    setBases(prev => prev.map(base => base.id === id ? { ...base, name: fileName, content: questions } : base));
  };

  const shuffleChoicesInQuestion = (text) => {
    const isSlashQuestion = text.trim().startsWith('////');
    const lines = text.split('\n');
    const questionLines = [];
    const choiceLines = [];

    if (isSlashQuestion) {
      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return; 
        if (trimmed.startsWith('////')) questionLines.push(line);
        else if (trimmed.startsWith('//')) choiceLines.push(line);
        else questionLines.push(line);
      });

      if (choiceLines.length === 0) return text;
      const shuffledChoices = shuffleArray(choiceLines);
      const cleanQuestion = questionLines.join('\n').trim();
      return [cleanQuestion, ...shuffledChoices].join('\n');

    } else {
      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        if (/^[A-Ea-e][\.\)]\s/.test(line) || line.startsWith('choice.')) choiceLines.push(line);
        else questionLines.push(line);
      });

      if (choiceLines.length === 0) return text;

      const choicesData = choiceLines.map(line => {
        const isCorrect = line.includes('*');
        const cleanContent = line.replace(/^[A-Ea-e][\.\)]\s+|^choice\.\s+/, '').replace(/\*$/, '').trim();
        return { content: cleanContent, isCorrect };
      });

      const shuffledData = shuffleArray(choicesData);
      const newChoiceLines = shuffledData.map((item, idx) => {
        const prefix = `${String.fromCharCode(65 + idx)}.`;
        return `${prefix} ${item.content}${item.isCorrect ? ' *' : ''}`;
      });

      const cleanQuestion = questionLines.join('\n').trim();
      return [cleanQuestion, ...newChoiceLines].join('\n');
    }
  };

  const generateTest = () => {
    let finalQuestions = [];
    bases.forEach(base => {
      if (base.content.length > 0 && base.count > 0) {
        const shuffledContent = shuffleArray(base.content);
        const selected = shuffledContent.slice(0, base.count);
        finalQuestions = [...finalQuestions, ...selected];
      }
    });

    if (isRandomized) finalQuestions = shuffleArray(finalQuestions);
    if (isChoiceRandomized) finalQuestions = finalQuestions.map(q => shuffleChoicesInQuestion(q));
    setGeneratedTest(finalQuestions);
  };

  const copyToClipboard = () => {
    const text = generatedTest.map((q, i) => showNumbering ? `${i + 1}. ${q}` : q).join('\n\n');
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  const handleFileUpload = (event, id) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.docx')) {
      if (!window.mammoth) return alert("Word document parser is loading...");
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          window.mammoth.extractRawText({ arrayBuffer: e.target.result })
            .then((result) => processTextContent(result.value, file.name, id))
            .catch(() => alert("Error reading Word file."));
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') processTextContent(e.target.result, file.name, id);
      };
      reader.readAsText(file);
    }
  };

  const handlePasteSave = () => {
    if (showPasteModal === null) return;
    const questions = parseQuestions(pasteText);
    setBases(prev => prev.map(base => base.id === showPasteModal ? { ...base, content: questions } : base));
    setShowPasteModal(null);
    setPasteText('');
  };

  const addBase = () => {
    let newNum = bases.length + 1;
    while (bases.some(base => base.name === `Base ${newNum}`)) newNum++;
    setBases([...bases, { id: Date.now(), name: `Base ${newNum}`, content: [], count: 0, type: 'file' }]);
  };

  return (
    <div className="space-y-8 print:hidden">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{t('gen_title')}</h1>
        <p className="text-gray-500">{t('gen_subtitle')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-600" />{t('gen_bases')}</h2>
          <div className="flex gap-2">
            <button onClick={resetApp} className="flex items-center gap-1 text-sm bg-red-50 text-red-700 px-3 py-1.5 rounded-lg font-medium"><RotateCcw className="w-4 h-4" /> {t('gen_reset')}</button>
            <button onClick={addBase} className="flex items-center gap-1 text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium"><Plus className="w-4 h-4" /> {t('gen_add')}</button>
          </div>
        </div>

        <div className="space-y-3">
          {bases.map((base, index) => (
            <div key={base.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50">
              <div className="flex-1 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <span className="bg-white text-gray-500 text-xs font-mono w-6 h-6 flex items-center justify-center rounded border border-gray-200">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 truncate max-w-[200px]">{base.name}</p>
                    <div className="flex gap-2 text-xs text-gray-500 mt-1">
                      <span className={base.content.length > 0 ? "text-green-600" : "text-amber-600"}>{base.content.length} qs</span>
                      <span>•</span>
                      <div className="flex gap-2">
                        <label className="cursor-pointer hover:text-indigo-600 underline">
                          {t('gen_upload')}
                          <input type="file" accept=".txt,.docx" className="hidden" onChange={(e) => handleFileUpload(e, base.id)} />
                        </label>
                        <span>or</span>
                        <button onClick={() => { setShowPasteModal(base.id); setPasteText(base.content.join('\n\n')); }} className="hover:text-indigo-600 underline">{t('gen_paste')}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 whitespace-nowrap">{t('gen_amount')}</label>
                  <input type="number" min="0" max={base.content.length} value={base.count} onChange={(e) => setBases(bases.map(b => b.id === base.id ? { ...b, count: parseInt(e.target.value) || 0 } : b))} className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-center" />
                </div>
                <button onClick={() => setBases(bases.filter(b => b.id !== base.id))} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {bases.length === 0 && <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">{t('gen_empty')}</div>}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
          <label className="flex items-center gap-3 cursor-pointer select-none bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${isRandomized ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${isRandomized ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <input type="checkbox" checked={isRandomized} onChange={() => setIsRandomized(!isRandomized)} className="hidden" />
            <span className="text-sm font-medium text-gray-700 uppercase tracking-wide flex items-center gap-2"><Shuffle className="w-4 h-4" /> {t('gen_rand_order')}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer select-none bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${isChoiceRandomized ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${isChoiceRandomized ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <input type="checkbox" checked={isChoiceRandomized} onChange={() => setIsChoiceRandomized(!isChoiceRandomized)} className="hidden" />
            <span className="text-sm font-medium text-gray-700 uppercase tracking-wide flex items-center gap-2"><List className="w-4 h-4" /> {t('gen_rand_choices')}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer select-none bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${showNumbering ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${showNumbering ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <input type="checkbox" checked={showNumbering} onChange={() => setShowNumbering(!showNumbering)} className="hidden" />
            <span className="text-sm font-medium text-gray-700 uppercase tracking-wide flex items-center gap-2"><Hash className="w-4 h-4" /> {t('gen_numbering')}</span>
          </label>
        </div>
        <button onClick={generateTest} className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-md font-semibold flex items-center justify-center gap-2"><RefreshCw className="w-5 h-5" /> {t('gen_btn')}</button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col min-h-[500px]">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">{t('gen_final')}</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{t('gen_total')} <span className="font-semibold text-gray-900">{generatedTest.length}</span></span>
            {generatedTest.length > 0 && <button onClick={copyToClipboard} className="flex items-center gap-1.5 text-xs bg-white border border-gray-300 px-3 py-1.5 rounded"><Copy className="w-3.5 h-3.5" /> {t('gen_copy')}</button>}
          </div>
        </div>
        <div className="p-8 flex-1 bg-white relative">
          {generatedTest.length > 0 ? (
            <div className="space-y-6 font-serif text-lg leading-relaxed text-gray-800">
              {generatedTest.map((question, idx) => (
                <div key={idx} className="flex gap-4">
                  {showNumbering && <span className="font-bold text-gray-400 select-none w-8 text-right flex-shrink-0">{idx + 1}.</span>}
                  <p className="whitespace-pre-wrap">{question}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 pointer-events-none">
              <FileText className="w-24 h-24 mb-4 opacity-20" />
            </div>
          )}
        </div>
      </div>

      {showPasteModal !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">{t('gen_paste_title')}</h3>
              <button onClick={() => setShowPasteModal(null)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-2">
              <p className="text-sm text-gray-500">{t('gen_paste_desc')}</p>
              <textarea className="w-full flex-1 min-h-[300px] p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-sm" value={pasteText} onChange={(e) => setPasteText(e.target.value)} />
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <button onClick={() => setShowPasteModal(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">{t('gen_cancel')}</button>
              <button onClick={handlePasteSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium flex items-center gap-2"><Check className="w-4 h-4" /> {t('gen_save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENT 2: ANSWER SHEET CONSTRUCTOR ---
function AnswerSheetConstructor({ t }) {
  const [numQuestions, setNumQuestions] = useState(30);
  const [numChoices, setNumChoices] = useState(4);
  const [internalCols, setInternalCols] = useState(2);
  const [ticketsPerRow, setTicketsPerRow] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const sheetRef = useRef(null);

  // --- PASSWORD & ANSWER KEY STATES ---
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [isAnswerKeyMode, setIsAnswerKeyMode] = useState(false);
  const [moduleName, setModuleName] = useState('1');
  const [useModuleHeaderOnStudentSheet, setUseModuleHeaderOnStudentSheet] = useState(true);
  const [fillMode, setFillMode] = useState('cycle'); // 'cycle' (fill whole sheet) | 'once' (1 ticket per set)
  const [sets, setSets] = useState([
    { id: 1, name: '1', answers: {}, bulkText: '' },
    { id: 2, name: '2', answers: {}, bulkText: '' },
  ]);

  const choices = useMemo(
    () => Array.from({ length: numChoices }, (_, i) => String.fromCharCode(97 + i)),
    [numChoices]
  );

  // Convert answers object { 1: ['a'], 2: ['c'] } -> compact string for bulk input
  const answersToBulkString = (answersObj, maxQ) => {
    const answeredNums = Object.keys(answersObj)
      .map(Number)
      .filter((n) => n <= maxQ && answersObj[n]?.length > 0);
    if (answeredNums.length === 0) return '';
    const highestQ = Math.max(...answeredNums);
    const parts = [];
    for (let q = 1; q <= highestQ; q++) {
      const sel = answersObj[q];
      if (!sel || sel.length === 0) {
        parts.push('-');
      } else if (sel.length === 1) {
        parts.push(sel[0]);
      } else {
        parts.push(`(${sel.join('')})`);
      }
    }
    return parts.join('');
  };

  // Parse bulk text (supports "abcd...", "1a 2b 3c", "1.a, 2.b", "a, b, c, d")
  const parseBulkString = (text, maxQ, validChoices) => {
    const trimmed = text.trim();
    if (!trimmed) return {};
    const validSet = new Set(validChoices.map((c) => c.toLowerCase()));
    const newAnswers = {};

    // Case 1: Explicit numbered pairs like "1a 2b 3c" or "1. a, 2: bc"
    if (/\d/.test(trimmed)) {
      const regex = /(\d+)\s*[.:=-]?\s*([a-zA-Z]+)/g;
      let match;
      while ((match = regex.exec(trimmed)) !== null) {
        const qNum = parseInt(match[1], 10);
        if (qNum >= 1 && qNum <= maxQ) {
          const letters = match[2]
            .toLowerCase()
            .split('')
            .filter((ch) => validSet.has(ch));
          if (letters.length > 0) {
            newAnswers[qNum] = Array.from(new Set(letters));
          }
        }
      }
      return newAnswers;
    }

    // Case 2: Space/comma separated tokens like "a, b, c, d" or "a b c d"
    if (/[\s,;]+/.test(trimmed)) {
      const tokens = trimmed.split(/[\s,;]+/);
      tokens.forEach((tok, idx) => {
        const qNum = idx + 1;
        if (qNum <= maxQ && tok !== '-' && tok !== '_') {
          const letters = tok
            .toLowerCase()
            .split('')
            .filter((ch) => validSet.has(ch));
          if (letters.length > 0) {
            newAnswers[qNum] = Array.from(new Set(letters));
          }
        }
      });
      return newAnswers;
    }

    // Case 3: Continuous string like "abcd-ab(cd)a"
    let qNum = 1;
    let i = 0;
    while (i < trimmed.length && qNum <= maxQ) {
      const ch = trimmed[i];
      if (ch === '(') {
        const closeIdx = trimmed.indexOf(')', i);
        const group = closeIdx !== -1 ? trimmed.slice(i + 1, closeIdx) : trimmed.slice(i + 1);
        const letters = group
          .toLowerCase()
          .split('')
          .filter((c) => validSet.has(c));
        if (letters.length > 0) {
          newAnswers[qNum] = Array.from(new Set(letters));
        }
        qNum++;
        i = closeIdx !== -1 ? closeIdx + 1 : trimmed.length;
      } else {
        const lower = ch.toLowerCase();
        if (validSet.has(lower)) {
          newAnswers[qNum] = [lower];
        }
        qNum++;
        i++;
      }
    }
    return newAnswers;
  };

  // --- SAVED KEYS & ARCHIVE STATES ---
  const [saveTitle, setSaveTitle] = useState('');
  const [saveYear, setSaveYear] = useState('2026');
  const [saveSemester, setSaveSemester] = useState('Autumn');
  const [savedKeys, setSavedKeys] = useState(() => {
    try {
      const raw = localStorage.getItem('answer_sheet_saved_keys_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [filterYear, setFilterYear] = useState('ALL');
  const [filterSemester, setFilterSemester] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedList, setShowSavedList] = useState(true);

  const persistSavedKeys = (nextKeys) => {
    setSavedKeys(nextKeys);
    try {
      localStorage.setItem('answer_sheet_saved_keys_v1', JSON.stringify(nextKeys));
    } catch (err) {
      console.error('Failed to save keys to localStorage', err);
    }
  };

  const handleSaveCurrentKey = () => {
    const newEntry = {
      id: Date.now(),
      title: saveTitle.trim() || `Module ${moduleName || '1'}`,
      year: saveYear.trim() || '2026',
      semester: saveSemester,
      moduleName,
      numQuestions,
      numChoices,
      internalCols,
      ticketsPerRow,
      rowsPerPage,
      fillMode,
      sets: JSON.parse(JSON.stringify(sets)),
      updatedAt: new Date().toISOString(),
    };
    persistSavedKeys([newEntry, ...savedKeys]);
    setSaveTitle('');
  };

  const handleLoadSavedKey = (item) => {
    setModuleName(item.moduleName ?? '1');
    setNumQuestions(item.numQuestions ?? 30);
    setNumChoices(item.numChoices ?? 4);
    setInternalCols(item.internalCols ?? 2);
    if (item.ticketsPerRow) setTicketsPerRow(item.ticketsPerRow);
    if (item.rowsPerPage) setRowsPerPage(item.rowsPerPage);
    setFillMode(item.fillMode ?? 'cycle');
    
    // Ensure bulkText is restored for each set so input boxes populate correctly
    const restoredSets = (item.sets || []).map((s) => ({
      ...s,
      bulkText: s.bulkText || answersToBulkString(s.answers || {}, item.numQuestions ?? 30),
    }));
    setSets(restoredSets);

    setSaveTitle(item.title || '');
    setSaveYear(item.year || '2026');
    setSaveSemester(item.semester || 'Autumn');
    setIsAnswerKeyMode(true);
  };

  const handleOverwriteSavedKey = (id) => {
    const updated = savedKeys.map((item) =>
      item.id === id
        ? {
            ...item,
            title: saveTitle.trim() || item.title,
            year: saveYear.trim() || item.year,
            semester: saveSemester || item.semester,
            moduleName,
            numQuestions,
            numChoices,
            internalCols,
            ticketsPerRow,
            rowsPerPage,
            fillMode,
            sets: JSON.parse(JSON.stringify(sets)),
            updatedAt: new Date().toISOString(),
          }
        : item
    );
    persistSavedKeys(updated);
  };

  const handleDeleteSavedKey = (id) => {
    persistSavedKeys(savedKeys.filter((item) => item.id !== id));
  };

  const availableYears = useMemo(() => {
    const yrs = new Set(savedKeys.map((k) => k.year).filter(Boolean));
    yrs.add('2026');
    return Array.from(yrs).sort((a, b) => Number(b) - Number(a));
  }, [savedKeys]);

  const filteredAndSortedKeys = useMemo(() => {
    return savedKeys
      .filter((item) => {
        if (filterYear !== 'ALL' && item.year !== filterYear) return false;
        if (filterSemester !== 'ALL' && item.semester !== filterSemester) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title?.toLowerCase().includes(q);
          const matchMod = String(item.moduleName || '').toLowerCase().includes(q);
          if (!matchTitle && !matchMod) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.updatedAt) - new Date(a.updatedAt);
        if (sortBy === 'oldest') return new Date(a.updatedAt) - new Date(b.updatedAt);
        if (sortBy === 'year_desc') {
          if (b.year !== a.year) return Number(b.year) - Number(a.year);
          return a.semester.localeCompare(b.semester);
        }
        if (sortBy === 'title_asc') return (a.title || '').localeCompare(b.title || '');
        return 0;
      });
  }, [savedKeys, filterYear, filterSemester, sortBy, searchQuery]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const envPassword =
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ANSWER_KEY_PASSWORD) ||
      (typeof process !== 'undefined' &&
        (process.env?.REACT_APP_ANSWER_KEY_PASSWORD ||
          process.env?.NEXT_PUBLIC_ANSWER_KEY_PASSWORD));

    if (envPassword && passwordInput === envPassword) {
      setIsUnlocked(true);
      setIsAnswerKeyMode(true);
      setShowPasswordPrompt(false);
      setPasswordInput('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setIsAnswerKeyMode(false);
    setShowPasswordPrompt(false);
    setPasswordInput('');
  };

  const addSet = () => {
    setSets((prev) => {
      const nextNum = prev.length + 1;
      return [
        ...prev,
        { id: Date.now(), name: String(nextNum), answers: {}, bulkText: '' },
      ];
    });
  };

  const removeSet = (id) => {
    if (sets.length <= 1) return;
    setSets((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSetName = (id, newName) => {
    setSets((prev) => prev.map((s) => (s.id === id ? { ...s, name: newName } : s)));
  };

  const handleBulkTextChange = (id, text) => {
    const parsed = parseBulkString(text, numQuestions, choices);
    setSets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, bulkText: text, answers: parsed } : s))
    );
  };

  const clearSetAnswers = (id) => {
    setSets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, answers: {}, bulkText: '' } : s))
    );
  };

  // Interactive cell click handler (toggles choice for that question in the given set)
  const toggleCellAnswer = (setId, qNum, choice, shiftKey = false) => {
    if (!isUnlocked || !isAnswerKeyMode || !qNum) return;
    setSets((prev) =>
      prev.map((s) => {
        if (s.id !== setId) return s;
        const current = s.answers[qNum] || [];
        let updated;
        if (shiftKey) {
          // Shift+click allows multiple correct choices for the same question
          updated = current.includes(choice)
            ? current.filter((c) => c !== choice)
            : [...current, choice].sort();
        } else {
          // Normal click sets single choice or clears if already selected
          updated = current.length === 1 && current[0] === choice ? [] : [choice];
        }
        const nextAnswers = { ...s.answers };
        if (updated.length === 0) {
          delete nextAnswers[qNum];
        } else {
          nextAnswers[qNum] = updated;
        }
        return {
          ...s,
          answers: nextAnswers,
          bulkText: answersToBulkString(nextAnswers, numQuestions),
        };
      })
    );
  };

  const recommendations = useMemo(() => {
    const USABLE_W_MM = 200;
    const USABLE_H_MM = 287;

    const NUM_W = 8;
    const CHOICE_W = 7;
    const COL_GAP = 3;
    const TICKET_PAD = 4;
    const HEADER_AND_PADDING_MM = 12;

    const ticketW =
      internalCols * (NUM_W + numChoices * CHOICE_W) +
      (internalCols - 1) * COL_GAP +
      TICKET_PAD;
    const recCols = Math.max(1, Math.floor(USABLE_W_MM / ticketW));

    const questionsPerCol = Math.ceil(numQuestions / internalCols);
    const totalTableRows = questionsPerCol + 1;

    const minRowHeightMm = 10 / (0.7 * 3.78);
    const minTicketH = minRowHeightMm * totalTableRows + HEADER_AND_PADDING_MM;

    const recRows = Math.max(1, Math.floor(USABLE_H_MM / minTicketH));

    return { recCols, recRows };
  }, [numQuestions, numChoices, internalCols]);

  useEffect(() => {
    setTicketsPerRow(recommendations.recCols);
    setRowsPerPage(recommendations.recRows);
  }, [recommendations.recCols, recommendations.recRows]);

  const layout = useMemo(() => {
    const PAGE_H_MM = 297;
    const PAGE_PAD_MM = 10;
    const USABLE_H_MM = PAGE_H_MM - PAGE_PAD_MM;

    const TICKET_H_MM = USABLE_H_MM / rowsPerPage;
    const HEADER_AND_PADDING_MM = 12;
    const TABLE_H_MM = TICKET_H_MM - HEADER_AND_PADDING_MM;

    const questionsPerCol = Math.ceil(numQuestions / internalCols);
    const totalTableRows = questionsPerCol + 1;
    const rowHeightMm = TABLE_H_MM / totalTableRows;

    let calcFontPx = rowHeightMm * 0.7 * 3.78;
    if (calcFontPx > 14) calcFontPx = 14;
    if (calcFontPx < 5) calcFontPx = 5;

    return {
      ticketsPerSheet: ticketsPerRow * rowsPerPage,
      gridCols: ticketsPerRow,
      gridRows: rowsPerPage,
      fontSizePx: calcFontPx,
      questionsPerCol: questionsPerCol,
    };
  }, [numQuestions, rowsPerPage, ticketsPerRow, internalCols]);

  const internalColumnData = useMemo(() => {
    return Array.from({ length: internalCols }, (_, colIndex) => {
      const numbers = [];
      for (let i = 0; i < layout.questionsPerCol; i++) {
        const qNum = colIndex * layout.questionsPerCol + i + 1;
        numbers.push(qNum <= numQuestions ? qNum : null);
      }
      return numbers;
    });
  }, [numQuestions, internalCols, layout.questionsPerCol]);

  const copyForGoogleDocs = () => {
    if (!sheetRef.current) return;
    const range = document.createRange();
    range.selectNode(sheetRef.current);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    try {
      document.execCommand('copy');
      alert('Copied!');
    } catch (err) {
      alert('Failed to copy manually.');
    }
    selection?.removeAllRanges();
  };

  const renderTicket = (ticketIndex) => {
    const assignedSet =
      sets.length > 0
        ? fillMode === 'once'
          ? sets[ticketIndex] || null
          : sets[ticketIndex % sets.length]
        : null;

    if (isAnswerKeyMode && fillMode === 'once' && !assignedSet) {
      return <div key={ticketIndex} style={{ width: '100%', height: '100%' }} />;
    }

    const setLabel = assignedSet ? assignedSet.name : '___';
    const modLabel = moduleName.trim() !== '' ? moduleName : '___';

    return (
      <div
        key={ticketIndex}
        style={{
          border: '1px dashed #999',
          padding: '2mm',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* TICKET HEADER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: `${Math.max(10, layout.fontSizePx)}px`,
            marginBottom: '2mm',
            fontWeight: 'bold',
            fontFamily: 'serif',
            gap: '2mm',
            whiteSpace: 'nowrap',
          }}
        >
          {isAnswerKeyMode ? (
            <>
              <span>
                Module {modLabel} - Set {setLabel}
              </span>
              <span
                style={{
                  fontSize: `${Math.max(8, layout.fontSizePx * 0.85)}px`,
                  border: '1px solid #000',
                  padding: '0 3px',
                }}
              >
                KEY
              </span>
            </>
          ) : (
            <>
              <span>{t('sheet_student')} ______________________</span>
              <span>{t('sheet_group')} _________</span>
            </>
          )}
        </div>

        {/* TABLES */}
        <div style={{ flex: 1, display: 'flex', gap: '2mm', minHeight: 0 }}>
          {internalColumnData.map((nums, colIdx) => (
            <table
              key={colIdx}
              style={{
                flex: 1,
                height: '100%',
                borderCollapse: 'collapse',
                fontSize: `${layout.fontSizePx}px`,
                lineHeight: '1.15',
                fontFamily: 'serif',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: '#222',
                    color: 'white',
                    height: '1px',
                    boxShadow: 'inset 0 0 0 1000px #222',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact',
                  }}
                >
                  <th style={{ border: '1px solid #000', padding: 0, width: '15%' }}>#</th>
                  <th style={{ border: '1px solid #000', padding: 0 }} colSpan={numChoices}>
                    {t('sheet_ans')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {nums.map((num, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        border: '1px solid #000',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        padding: 0,
                      }}
                    >
                      {num ? `${num}.` : ''}
                    </td>
                    {choices.map((choice) => {
                      const isMarked =
                        isAnswerKeyMode &&
                        num &&
                        assignedSet &&
                        assignedSet.answers[num]?.includes(choice);

                      return (
                        <td
                          key={choice}
                          onClick={(e) =>
                            num &&
                            assignedSet &&
                            toggleCellAnswer(assignedSet.id, num, choice, e.shiftKey)
                          }
                          title={
                            isAnswerKeyMode && num
                              ? `Click to mark Q${num} = ${choice.toUpperCase()} (Shift+Click for multi)`
                              : undefined
                          }
                          style={{
                            border: '1px solid #000',
                            textAlign: 'center',
                            padding: 0,
                            userSelect: 'none',
                            cursor: isAnswerKeyMode && num ? 'pointer' : 'default',
                            backgroundColor: isMarked ? '#000000' : 'transparent',
                            color: isMarked ? '#ffffff' : '#000000',
                            fontWeight: isMarked ? 'bold' : 'normal',
                            boxShadow: isMarked ? 'inset 0 0 0 1000px #000000' : 'none',
                            WebkitPrintColorAdjust: 'exact',
                            printColorAdjust: 'exact',
                          }}
                        >
                          {num ? choice : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <style>{`
        @media print {
          @page { size: A4; margin: 0mm; }
          body { visibility: hidden; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          #answer-sheet-container {
            visibility: visible !important;
            position: fixed;
            left: 0;
            top: 0;
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 5mm;
            background: white;
            z-index: 9999;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #answer-sheet-container * {
            visibility: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden { display: none !important; }
        }
      `}</style>

      <div className="text-center space-y-2 print:hidden">
        <h1 className="text-3xl font-bold text-gray-900">{t('sheet_title')}</h1>
        <p className="text-gray-500">{t('sheet_subtitle')}</p>
      </div>

      {/* MAIN CONTROLS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-wrap gap-4 items-end justify-center print:hidden">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {t('sheet_total')}
          </label>
          <input
            type="number"
            min="1"
            max="200"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {t('sheet_choices')}
          </label>
          <select
            value={numChoices}
            onChange={(e) => setNumChoices(Number(e.target.value))}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value={3}>3 (a-c)</option>
            <option value={4}>4 (a-d)</option>
            <option value={5}>5 (a-e)</option>
            <option value={6}>6 (a-f)</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {t('sheet_q_cols')}
          </label>
          <select
            value={internalCols}
            onChange={(e) => setInternalCols(Number(e.target.value))}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {t('sheet_page_grid')}
          </label>
          <select
            value={`${ticketsPerRow}x${rowsPerPage}`}
            onChange={(e) => {
              const [c, r] = e.target.value.split('x').map(Number);
              setTicketsPerRow(c);
              setRowsPerPage(r);
            }}
            className="w-56 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-700 bg-indigo-50"
          >
            {Array.from({ length: Math.max(4, recommendations.recCols) }, (_, i) => i + 1).map(
              (c) => (
                <optgroup key={c} label={`${c} Columns Wide`}>
                  {Array.from(
                    { length: Math.max(10, recommendations.recRows + 2) },
                    (_, i) => i + 1
                  ).map((r) => {
                    const isRec = c === recommendations.recCols && r === recommendations.recRows;
                    return (
                      <option key={`${c}x${r}`} value={`${c}x${r}`}>
                        {c} x {r} = {c * r} {t('sheet_tickets')}{' '}
                        {isRec ? t('sheet_recommended') : ''}
                      </option>
                    );
                  })}
                </optgroup>
              )
            )}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 ml-auto">
          {!isUnlocked ? (
            <button
              type="button"
              onClick={() => {
                setShowPasswordPrompt((prev) => !prev);
                setPasswordError(false);
              }}
              className="bg-amber-50 border border-amber-300 text-amber-800 px-4 py-2.5 rounded-lg font-medium hover:bg-amber-100 transition-colors flex items-center gap-2"
            >
              <span>🔒</span> Answer Key
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLock}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <span>🔓</span> Lock Key
            </button>
          )}

          <button
            onClick={copyForGoogleDocs}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Copy className="w-4 h-4" /> {t('sheet_btn_copy')}
          </button>
          <button
            onClick={() => setTimeout(() => window.print(), 100)}
            className="bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> {t('sheet_btn_print')}
          </button>
        </div>
      </div>

      {/* PASSWORD PROMPT */}
      {showPasswordPrompt && !isUnlocked && (
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-wrap items-center justify-center gap-3 print:hidden shadow-sm"
        >
          <span className="text-sm font-semibold text-amber-900">
            Enter Password to Unlock Answer Key Mode:
          </span>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.target.value);
              setPasswordError(false);
            }}
            placeholder="Password..."
            autoFocus
            className={`px-3 py-1.5 border rounded-lg text-sm outline-none ${
              passwordError
                ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-400'
                : 'border-amber-300 bg-white focus:ring-2 focus:ring-amber-500'
            }`}
          />
          <button
            type="submit"
            className="bg-amber-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors"
          >
            Unlock
          </button>
          <button
            type="button"
            onClick={() => setShowPasswordPrompt(false)}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
          >
            Cancel
          </button>
          {passwordError && (
            <span className="text-xs font-bold text-red-600">Incorrect password!</span>
          )}
        </form>
      )}

      {/* UNLOCKED ANSWER KEY MANAGER */}
      {isUnlocked && (
        <div className="bg-white rounded-xl shadow-sm border-2 border-indigo-200 p-6 space-y-5 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 font-bold text-xs rounded-md uppercase tracking-wide">
                Answer Key Manager
              </span>
              <span className="text-xs text-gray-500">
                Click table cells directly in the sheet preview below or type/paste answers per set.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Sheet Mode Toggle */}
              <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setIsAnswerKeyMode(false)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    !isAnswerKeyMode
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Student Blank Sheet
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnswerKeyMode(true)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    isAnswerKeyMode
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Filled Answer Key
                </button>
              </div>
            </div>
          </div>

          {/* Header & Layout Controls */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-600 uppercase">Module #:</label>
              <input
                type="text"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                placeholder="e.g. 1"
                className="w-20 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-600 uppercase">
                Sheet Distribution:
              </label>
              <select
                value={fillMode}
                onChange={(e) => setFillMode(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="cycle">Repeat / Cycle sets to fill all tickets</option>
                <option value="once">1 Ticket per Set only</option>
              </select>
            </div>

            {!isAnswerKeyMode && (
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useModuleHeaderOnStudentSheet}
                  onChange={(e) => setUseModuleHeaderOnStudentSheet(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Show "Module N - Set N" on Student Blank Sheets
              </label>
            )}

            <button
              type="button"
              onClick={addSet}
              className="ml-auto bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
            >
              + Add Set
            </button>
          </div>

          {/* SAVE & ARCHIVE BAR */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1 flex-1 min-w-[180px]">
                <label className="block text-[11px] font-bold text-gray-600 uppercase">
                  Key Title / Subject
                </label>
                <input
                  type="text"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder={`e.g. Midterm Exam (Default: Module ${moduleName || '1'})`}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-600 uppercase">
                  Year
                </label>
                <input
                  type="number"
                  value={saveYear}
                  onChange={(e) => setSaveYear(e.target.value)}
                  placeholder="2026"
                  className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-600 uppercase">
                  Semester
                </label>
                <select
                  value={saveSemester}
                  onChange={(e) => setSaveSemester(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Autumn">Autumn Semester</option>
                  <option value="Spring">Spring Semester</option>
                  <option value="Summer">Summer Semester</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleSaveCurrentKey}
                className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                💾 Save Key
              </button>

              <button
                type="button"
                onClick={() => setShowSavedList((prev) => !prev)}
                className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
              >
                {showSavedList ? 'Hide' : 'Show'} Saved ({savedKeys.length})
              </button>
            </div>

            {/* SAVED KEYS LIST & FILTERS */}
            {showSavedList && (
              <div className="border-t border-indigo-100 pt-3 space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-gray-600 uppercase text-[11px]">Filter & Sort:</span>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="px-2.5 py-1 border border-gray-300 rounded-md bg-white text-xs"
                  >
                    <option value="ALL">All Years</option>
                    {availableYears.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterSemester}
                    onChange={(e) => setFilterSemester(e.target.value)}
                    className="px-2.5 py-1 border border-gray-300 rounded-md bg-white text-xs"
                  >
                    <option value="ALL">All Semesters</option>
                    <option value="Autumn">Autumn Semester</option>
                    <option value="Spring">Spring Semester</option>
                    <option value="Summer">Summer Semester</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1 border border-gray-300 rounded-md bg-white text-xs"
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="oldest">Sort: Oldest First</option>
                    <option value="year_desc">Sort: Year & Semester</option>
                    <option value="title_asc">Sort: Title (A-Z)</option>
                  </select>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search title or module..."
                    className="ml-auto px-2.5 py-1 border border-gray-300 rounded-md bg-white text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {filteredAndSortedKeys.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-2 text-center">
                    No saved answer keys match your filter.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                    {filteredAndSortedKeys.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-lg p-2.5 flex items-center justify-between gap-2 shadow-sm"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded text-[10px] font-bold">
                              {item.year} • {item.semester}
                            </span>
                            <span className="font-bold text-xs text-gray-800 truncate">
                              {item.title}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Module {item.moduleName} • {item.sets?.length || 0} Sets •{' '}
                            {item.numQuestions} Qs
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleLoadSavedKey(item)}
                            className="px-2.5 py-1 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700"
                          >
                            Load
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOverwriteSavedKey(item.id)}
                            title="Overwrite with current sets/settings"
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSavedKey(item.id)}
                            title="Delete saved key"
                            className="px-2 py-1 text-red-500 hover:bg-red-50 rounded text-xs font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SETS LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sets.map((s) => {
              const answeredCount = Object.keys(s.answers).filter(
                (q) => Number(q) <= numQuestions && s.answers[q]?.length > 0
              ).length;

              return (
                <div
                  key={s.id}
                  className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        Module {moduleName || '_'} - Set
                      </span>
                      <input
                        type="text"
                        value={s.name}
                        onChange={(e) => updateSetName(s.id, e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {answeredCount} / {numQuestions} answered
                      </span>
                      <button
                        type="button"
                        onClick={() => clearSetAnswers(s.id)}
                        className="text-xs text-gray-500 hover:text-gray-800 px-1.5 py-0.5"
                        title="Clear answers for this set"
                      >
                        Clear
                      </button>
                      {sets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSet(s.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-bold px-1.5 py-0.5"
                          title="Delete Set"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={s.bulkText}
                    onChange={(e) => handleBulkTextChange(s.id, e.target.value)}
                    placeholder={`Type e.g. "abcdab..." or "1a 2b 3c..." (use "-" to skip)`}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs font-mono bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STATUS BAR */}
      <div className="bg-indigo-50 text-indigo-700 px-4 py-3 rounded-xl text-sm font-medium flex justify-center items-center gap-3 print:hidden shadow-sm border border-indigo-100">
        <Settings className="w-4 h-4" />
        <span>
          {t('sheet_fitting')} {layout.ticketsPerSheet} {t('sheet_tickets')} ({layout.gridRows}x
          {layout.gridCols})
        </span>
        <span className="opacity-50">•</span>
        <span>
          {t('sheet_font')}:{' '}
          <span
            className={
              layout.fontSizePx < 10 ? 'text-red-600 font-bold' : 'text-green-700 font-bold'
            }
          >
            {layout.fontSizePx.toFixed(1)}px
          </span>
        </span>
        {isUnlocked && (
          <>
            <span className="opacity-50">•</span>
            <span className="font-bold text-indigo-900">
              Mode: {isAnswerKeyMode ? `Answer Key (${sets.length} Sets)` : 'Student Blank Sheet'}
            </span>
          </>
        )}
      </div>

      {/* SHEET PREVIEW / PRINT CONTAINER */}
      <div className="flex justify-center bg-gray-200 p-8 overflow-auto print:bg-white print:p-0">
        <div
          id="answer-sheet-container"
          ref={sheetRef}
          className="bg-white shadow-2xl mx-auto text-black"
          style={{
            width: '210mm',
            height: '297mm',
            boxSizing: 'border-box',
            padding: '5mm',
            display: 'grid',
            gridTemplateColumns: `repeat(${layout.gridCols}, 1fr)`,
            gridTemplateRows: `repeat(${layout.gridRows}, 1fr)`,
            gap: '2mm',
          }}
        >
          {Array.from({ length: layout.ticketsPerSheet }).map((_, i) => renderTicket(i))}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT 3: MCQ GRADER (UPDATED WITH EXAM VITALS / BALANCE BAR) ---
function MCQGrader({ t }) {
  const [keysInput, setKeysInput] = useState('');
  const [studentsInput, setStudentsInput] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  const [isNegativeMarking, setIsNegativeMarking] = useState(false);
  const [penalty, setPenalty] = useState(0.33);

  const DIFFICULTY_TOO_HARD = 30; 
  const DIFFICULTY_TOO_EASY = 80;

  const parsedKeys = useMemo(() => {
    if (!keysInput.trim()) return {};
    const keys = {};
    keysInput.split('\n').forEach(line => {
      const cleanLine = line.trim();
      if (!cleanLine) return;
      const parts = cleanLine.split(/\s+/);
      if (parts.length >= 2) {
        const version = parts[0].toUpperCase();
        const answers = parts[parts.length - 1].toUpperCase().replace(/[^A-Z0-9]/g, '');
        keys[version] = answers;
      }
    });
    return keys;
  }, [keysInput]);

  const gradingResults = useMemo(() => {
    if (Object.keys(parsedKeys).length === 0 || !studentsInput.trim()) return [];

    return studentsInput.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, index) => {
        const parts = line.split(/\s+/);
        if (parts.length < 3) return { id: index, originalLine: line, error: "Invalid format. Use: [Name] [Version] [Answers]" };

        const answers = parts.pop().toUpperCase().replace(/[^A-Z0-9]/g, '');
        const version = parts.pop().toUpperCase();
        const name = parts.join(' ');

        const key = parsedKeys[version];
        if (!key) return { id: index, name, version, originalLine: line, error: `Key '${version}' not found` };

        let score = 0;
        const comparison = [];
        const wrongQuestionNumbers = [];

        for (let i = 0; i < key.length; i++) {
          const keyChar = key[i];
          const studentChar = answers[i] || '-';
          
          let isCorrect = false;
          let isVoid = keyChar === 'V';
          let isSkipped = studentChar === '-' || studentChar === 'X';

          if (isVoid) {
            isCorrect = true; 
            score += 1;
          } else if (keyChar === studentChar) {
            isCorrect = true;
            score += 1;
          } else {
            if (!isSkipped && isNegativeMarking) {
              score -= parseFloat(penalty) || 0;
            }
            wrongQuestionNumbers.push(i + 1);
          }

          comparison.push({ index: i + 1, keyChar, studentChar, isCorrect, isVoid, isSkipped });
        }

        score = Number(score.toFixed(2));
        const percentage = key.length > 0 ? Math.round(Math.max(0, (score / key.length) * 100)) : 0;
        
        return { id: index, name, version, originalLine: line, answers, score, percentage, comparison, wrongQuestionNumbers, totalQuestions: key.length, error: null };
      });
  }, [parsedKeys, studentsInput, isNegativeMarking, penalty]);

  const statistics = useMemo(() => {
    const validResults = gradingResults.filter(r => !r.error);
    const statsByVersion = {};

    Object.keys(parsedKeys).forEach(version => {
      statsByVersion[version] = { 
        totalStudents: 0, 
        averageScore: 0, 
        highestScore: -999, 
        itemStats: Array.from({ length: parsedKeys[version].length }, (_, i) => ({ 
          questionIndex: i + 1, 
          correctCount: 0, 
          expectedAnswer: parsedKeys[version][i], 
          discrimination: null,
          distractorEfficiency: null,
          isVoid: parsedKeys[version][i] === 'V',
          answerFrequencies: {} 
        })) 
      };
    });

    validResults.forEach(student => {
      const vStats = statsByVersion[student.version];
      if (!vStats) return;
      
      vStats.totalStudents++;
      vStats.averageScore += student.score;
      if (student.score > vStats.highestScore) vStats.highestScore = student.score;
      
      student.comparison.forEach((comp, idx) => { 
        if (vStats.itemStats[idx] && !vStats.itemStats[idx].isVoid) {
          if (comp.isCorrect) {
            vStats.itemStats[idx].correctCount++; 
          }
          const chosen = comp.studentChar;
          if (/^[A-Z0-9]$/.test(chosen) && chosen !== 'X' && chosen !== 'V') {
            vStats.itemStats[idx].answerFrequencies[chosen] = (vStats.itemStats[idx].answerFrequencies[chosen] || 0) + 1;
          }
        }
      });
    });

    Object.keys(statsByVersion).forEach(version => {
      const vStats = statsByVersion[version];
      const studentsForVersion = validResults.filter(s => s.version === version).sort((a, b) => b.score - a.score);
      const n = studentsForVersion.length;
      
      const canCalculateD = n >= 3;
      const groupSize = Math.max(1, Math.floor(n * 0.33));
      const upperGroup = studentsForVersion.slice(0, groupSize);
      const lowerGroup = studentsForVersion.slice(n - groupSize);

      const allChars = new Set();
      parsedKeys[version].split('').forEach(c => { if(/^[A-Z]$/.test(c) && c !== 'V') allChars.add(c); });
      studentsForVersion.forEach(s => s.answers.split('').forEach(c => { if(/^[A-Z]$/.test(c) && c !== 'X' && c !== 'V') allChars.add(c); }));
      const maxCharCode = Array.from(allChars).reduce((max, char) => Math.max(max, char.charCodeAt(0)), 68); 
      const expectedOptionsCount = maxCharCode - 64; 

      if (vStats.totalStudents > 0) {
        vStats.averageScore = (vStats.averageScore / vStats.totalStudents).toFixed(2);
        
        vStats.itemStats = vStats.itemStats.map((item, idx) => {
          if (item.isVoid) {
            return { ...item, percentCorrect: null, discrimination: null, distractorEfficiency: null, flag: 'VOID' };
          }

          const pValue = Math.round((item.correctCount / vStats.totalStudents) * 100);
          
          let dIndex = null;
          let flag = null;

          if (canCalculateD) {
            const upperCorrect = upperGroup.filter(s => s.comparison[idx].isCorrect).length;
            const lowerCorrect = lowerGroup.filter(s => s.comparison[idx].isCorrect).length;
            const pUpper = upperCorrect / groupSize;
            const pLower = lowerCorrect / groupSize;
            dIndex = parseFloat((pUpper - pLower).toFixed(2));

            if (dIndex < 0 && pValue < DIFFICULTY_TOO_HARD) flag = 'TOXIC';
            else if (dIndex >= 0.25 && pValue < DIFFICULTY_TOO_HARD) flag = 'ELITE';
            else if (dIndex >= 0.25 && pValue >= 40 && pValue <= 80) flag = 'WORKHORSE';
            else if (pValue > DIFFICULTY_TOO_EASY) flag = 'FREEBIE';
          } else {
             if (pValue < DIFFICULTY_TOO_HARD) flag = 'HARD';
             if (pValue > DIFFICULTY_TOO_EASY) flag = 'FREEBIE';
          }

          const totalDistractors = expectedOptionsCount - 1;
          let functionalDistractors = 0;
          
          const choiceArray = Array.from({ length: expectedOptionsCount }, (_, i) => String.fromCharCode(65 + i));
          
          choiceArray.forEach(choice => {
             if (choice !== item.expectedAnswer) {
                 const count = item.answerFrequencies[choice] || 0;
                 if (count > 0) functionalDistractors++;
             }
          });

          const deValue = totalDistractors > 0 ? Math.round((functionalDistractors / totalDistractors) * 100) : null;

          return { ...item, percentCorrect: pValue, discrimination: dIndex, distractorEfficiency: deValue, flag };
        });
      }
    });

    return statsByVersion;
  }, [gradingResults, parsedKeys]);

  if (showReport) {
    return (
      <div className="bg-white p-8 max-w-5xl mx-auto rounded-xl shadow-sm print:shadow-none print:p-0">
        <div className="flex justify-between items-center mb-8 print:hidden">
          <h2 className="text-2xl font-bold text-gray-800">{t('rep_title')}</h2>
          <div className="flex gap-4">
            <button onClick={() => setShowReport(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">{t('rep_back')}</button>
            <button onClick={() => window.print()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700"><Printer className="w-4 h-4" /> {t('rep_print')}</button>
          </div>
        </div>

        <div className="space-y-12">
          {Object.entries(statistics).map(([version, data]) => {
            
            // Calculate Exam Vitals percentages dynamically per test version
            const validItems = data.itemStats.filter(s => !s.isVoid);
            const totalValid = validItems.length;
            
            const countElite = validItems.filter(s => s.flag === 'ELITE').length;
            const countWorkhorse = validItems.filter(s => s.flag === 'WORKHORSE').length;
            const countFreebie = validItems.filter(s => s.flag === 'FREEBIE').length;
            const countToxic = validItems.filter(s => s.flag === 'TOXIC').length;
            const countStd = validItems.filter(s => !['ELITE', 'WORKHORSE', 'FREEBIE', 'TOXIC'].includes(s.flag)).length;

            const pctElite = totalValid ? Math.round((countElite / totalValid) * 100) : 0;
            const pctWorkhorse = totalValid ? Math.round((countWorkhorse / totalValid) * 100) : 0;
            const pctFreebie = totalValid ? Math.round((countFreebie / totalValid) * 100) : 0;
            const pctToxic = totalValid ? Math.round((countToxic / totalValid) * 100) : 0;
            const pctStd = totalValid ? Math.round((countStd / totalValid) * 100) : 0;

            return (
              <div key={version} className="border border-gray-200 rounded-lg overflow-hidden break-inside-avoid">
                {/* Version Title & Basic Stats */}
                <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">{t('rep_version')} {version}</h3>
                  <div className="flex gap-4 text-sm">
                    <span className="font-semibold text-gray-600">{t('grad_students')}: <span className="text-gray-900">{data.totalStudents}</span></span>
                    <span className="font-semibold text-gray-600">{t('grad_avg')}: <span className="text-indigo-600">{data.averageScore}</span></span>
                    <span className="font-semibold text-gray-600">{t('grad_best')}: <span className="text-green-600">{data.highestScore}</span></span>
                  </div>
                </div>
                
                {/* 📊 EXAM BALANCE SUMMARY BAR */}
                <div className="bg-white px-4 py-3 border-b border-gray-200 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><Check className="w-3 h-3 text-green-600" /> {t('cat_workhorse')}</span>
                    <span className="text-lg font-bold text-gray-800">{pctWorkhorse}% <span className="text-xs text-gray-400 font-normal">{t('rep_target_workhorse')}</span></span>
                  </div>
                  <div className="flex flex-col border-l border-gray-100 pl-4">
                    <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><Award className="w-3 h-3 text-purple-600" /> {t('cat_elite')}</span>
                    <span className="text-lg font-bold text-gray-800">{pctElite}% <span className="text-xs text-gray-400 font-normal">{t('rep_target_elite')}</span></span>
                  </div>
                  <div className="flex flex-col border-l border-gray-100 pl-4">
                    <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><Activity className="w-3 h-3 text-yellow-500" /> {t('cat_freebie')}</span>
                    <span className="text-lg font-bold text-gray-800">{pctFreebie}% <span className="text-xs text-gray-400 font-normal">{t('rep_target_freebie')}</span></span>
                  </div>
                  <div className="flex flex-col border-l border-gray-100 pl-4">
                    <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><AlertCircle className="w-3 h-3 text-red-500" /> {t('cat_toxic')}</span>
                    <span className={`text-lg font-bold ${pctToxic > 0 ? 'text-red-600' : 'text-gray-800'}`}>{pctToxic}% <span className="text-xs text-gray-400 font-normal">{t('rep_target_toxic')}</span></span>
                  </div>
                  <div className="flex flex-col border-l border-gray-100 pl-4">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{t('cat_std')}</span>
                    <span className="text-lg font-bold text-gray-800">{pctStd}% <span className="text-xs text-gray-400 font-normal">{t('rep_target_std')}</span></span>
                  </div>
                </div>

                {/* Individual Question Table */}
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold w-12 text-center">{t('rep_q')}</th>
                      <th className="px-4 py-3 font-semibold w-24 text-center">{t('rep_ans')}</th>
                      <th className="px-4 py-3 font-semibold w-32 text-center">{t('rep_rate')}</th>
                      <th className="px-4 py-3 font-semibold w-32 text-center">{t('rep_disc')}</th>
                      <th className="px-4 py-3 font-semibold w-32 text-center">{t('rep_de')}</th>
                      <th className="px-4 py-3 font-semibold">{t('rep_analysis')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.itemStats.map((stat) => {
                      const freqString = Object.entries(stat.answerFrequencies)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([ans, count]) => `${ans}: ${count}`)
                        .join(' | ');

                      return (
                        <tr key={stat.questionIndex} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <td className="px-4 py-3 text-center font-medium text-gray-900">{stat.questionIndex}</td>
                          <td className="px-4 py-3 text-center font-mono">{stat.expectedAnswer}</td>
                          <td className="px-4 py-3 text-center">
                            {stat.isVoid ? (
                               <span className="font-bold text-gray-300">-</span>
                            ) : (
                               <span className={`font-bold ${stat.percentCorrect < 30 ? 'text-red-600' : stat.percentCorrect > 80 ? 'text-yellow-600' : 'text-gray-700'}`}>
                                 {data.totalStudents > 0 ? stat.percentCorrect : 0}%
                               </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {stat.discrimination !== null ? (
                              <span className={`font-bold ${stat.discrimination < 0 ? 'text-red-600' : stat.discrimination > 0.25 ? 'text-green-600' : 'text-gray-500'}`}>
                                {stat.discrimination > 0 ? '+' : ''}{stat.discrimination}
                              </span>
                            ) : <span className="font-bold text-gray-300">-</span>}
                          </td>
                          <td className="px-4 py-3 text-center cursor-help" title={`Answers chosen: ${freqString || 'None'}`}>
                            {stat.distractorEfficiency !== null ? (
                              <span className={`font-bold border-b border-dashed border-gray-300 pb-0.5 ${stat.distractorEfficiency === 0 ? 'text-red-600' : stat.distractorEfficiency >= 66 ? 'text-green-600' : 'text-yellow-600'}`}>
                                {stat.distractorEfficiency}%
                              </span>
                            ) : <span className="font-bold text-gray-300">-</span>}
                          </td>
                          <td className="px-4 py-3">
                            {stat.flag === 'VOID' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-600 border border-gray-300"><Slash className="w-3.5 h-3.5" /> {t('rep_void_badge')}</span>}
                            {stat.flag === 'TOXIC' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800 border border-red-200"><AlertCircle className="w-3.5 h-3.5" /> {t('rep_toxic')}</span>}
                            {stat.flag === 'ELITE' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200"><Award className="w-3.5 h-3.5" /> {t('rep_elite')}</span>}
                            {stat.flag === 'WORKHORSE' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800 border border-green-200"><Check className="w-3.5 h-3.5" /> {t('rep_workhorse')}</span>}
                            {stat.flag === 'FREEBIE' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200"><Activity className="w-3.5 h-3.5" /> {t('rep_freebie')}</span>}
                            
                            {!['VOID', 'TOXIC', 'ELITE', 'WORKHORSE', 'FREEBIE'].includes(stat.flag) && data.totalStudents >= 3 && <span className="text-xs text-gray-500">{t('rep_std')}</span>}
                            {data.totalStudents > 0 && data.totalStudents < 3 && !stat.isVoid && <span className="text-xs text-gray-400">{t('rep_nodata')}</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:hidden">
      
      {/* --- OFFICIAL USER GUIDE MODAL --- */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col my-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-indigo-600" /> 
                {t('guide_title')}
              </h2>
              <button onClick={() => setShowGuide(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-8 text-gray-700 text-sm leading-relaxed">
              <p className="text-base font-medium text-gray-600 leading-relaxed border-l-4 border-indigo-500 pl-4 bg-indigo-50/50 p-4 rounded-r-lg">
                {t('guide_intro')}
              </p>

              {/* Section 1 */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">{t('g1_title')}</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-bold text-indigo-700">{t('g1_sub1')}</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>{t('g1_format1')}</li>
                    <li>{t('g1_v')}</li>
                    <li className="font-medium text-gray-900">{t('g1_rule1')}</li>
                  </ul>
                  <h4 className="font-bold text-indigo-700 mt-4">{t('g1_sub2')}</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>{t('g1_format2')}</li>
                    <li>{t('g1_x')}</li>
                    <li className="font-medium text-gray-900">{t('g1_rule2')}</li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">{t('g2_title')}</h3>
                <p>{t('g2_intro')}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-bold text-indigo-700 mb-2">{t('g2_diff_title')}</h4>
                    <p className="mb-2"><strong>{t('g2_diff_what')}</strong></p>
                    <p className="font-semibold mb-1">{t('g2_diff_how')}</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>{t('g2_diff_1')}</li>
                      <li>{t('g2_diff_2')}</li>
                      <li>{t('g2_diff_3')}</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-bold text-indigo-700 mb-2">{t('g2_disc_title')}</h4>
                    <p className="mb-2"><strong>{t('g2_disc_what')}</strong></p>
                    <p className="font-semibold mb-1">{t('g2_disc_how')}</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><span className="text-green-600 font-bold">{t('g2_disc_1').split(':')[0]}:</span> {t('g2_disc_1').split(':').slice(1).join(':')}</li>
                      <li><span className="text-gray-500 font-bold">{t('g2_disc_2').split(':')[0]}:</span> {t('g2_disc_2').split(':').slice(1).join(':')}</li>
                      <li><span className="text-red-600 font-bold">{t('g2_disc_3').split(':')[0]}:</span> {t('g2_disc_3').split(':').slice(1).join(':')}</li>
                    </ul>
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg bg-indigo-50/30">
                  <h4 className="font-bold text-indigo-700 mb-2">{t('g2_de_title')}</h4>
                  <p className="mb-2"><strong>{t('g2_de_what')}</strong></p>
                  <p className="mb-2"><strong>{t('g2_de_why')}</strong></p>
                  <p className="font-semibold mb-1">{t('g2_de_how')}</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
                    <li><span className="font-bold text-green-600">{t('g2_de_1').split(':')[0]}:</span> {t('g2_de_1').split(':').slice(1).join(':')}</li>
                    <li><span className="font-bold text-yellow-600">{t('g2_de_2').split(':')[0]}:</span> {t('g2_de_2').split(':').slice(1).join(':')}</li>
                    <li><span className="font-bold text-red-600">{t('g2_de_3').split(':')[0]}:</span> {t('g2_de_3').split(':').slice(1).join(':')}</li>
                  </ul>
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded text-amber-900 font-medium text-xs">
                    {t('g2_de_note')}
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">{t('g3_title')}</h3>
                <p>{t('g3_intro')}</p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="font-bold text-gray-800">{t('g3_why')}</p>
                  <p>{t('g3_why_text')}</p>
                  <p className="font-bold text-indigo-700 mt-2">{t('g3_form')}</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 font-mono bg-white p-2 rounded border border-gray-200 inline-block">
                    <li>{t('g3_form_1')}</li>
                    <li>{t('g3_form_2')}</li>
                  </ul>
                  <p className="text-xs text-gray-500 italic mt-2">{t('g3_note')}</p>
                </div>
              </div>

              {/* Section 4 */}
              <div className="space-y-4 pb-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">{t('g4_title')}</h3>
                <p>{t('g4_intro')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border border-purple-200 bg-purple-50 p-3 rounded-lg flex gap-2">
                    <Award className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <p><span className="font-bold text-purple-800">{t('g4_1').split(':')[0]}:</span> {t('g4_1').split(':').slice(1).join(':')}</p>
                  </div>
                  <div className="border border-green-200 bg-green-50 p-3 rounded-lg flex gap-2">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <p><span className="font-bold text-green-800">{t('g4_2').split(':')[0]}:</span> {t('g4_2').split(':').slice(1).join(':')}</p>
                  </div>
                  <div className="border border-yellow-200 bg-yellow-50 p-3 rounded-lg flex gap-2">
                    <Activity className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <p><span className="font-bold text-yellow-800">{t('g4_3').split(':')[0]}:</span> {t('g4_3').split(':').slice(1).join(':')}</p>
                  </div>
                  <div className="border border-red-200 bg-red-50 p-3 rounded-lg flex gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p><span className="font-bold text-red-800">{t('g4_4').split(':')[0]}:</span> {t('g4_4').split(':').slice(1).join(':')}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <div className="text-center space-y-2 relative">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">{t('grad_title')}</h1>
          <button onClick={() => setShowGuide(true)} className="text-indigo-500 hover:text-indigo-700 bg-indigo-50 p-1.5 rounded-full transition-colors flex-shrink-0" title={t('guide_title')}>
            <Info className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-500">{t('grad_subtitle')}</p>
      </div>

      <div className="flex justify-between items-center border-b border-gray-200 pb-4 flex-wrap gap-4">
        {/* Negative Marking Control Panel */}
        <div className="flex items-center gap-6 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${isNegativeMarking ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${isNegativeMarking ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <input type="checkbox" checked={isNegativeMarking} onChange={() => setIsNegativeMarking(!isNegativeMarking)} className="hidden" />
            <span className="text-sm font-semibold text-gray-700">{t('grad_neg_marking')}</span>
          </label>
          
          {isNegativeMarking && (
            <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('grad_penalty')}</label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                max="1" 
                value={penalty} 
                onChange={(e) => setPenalty(e.target.value)} 
                className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-indigo-700" 
              />
            </div>
          )}
        </div>

        {gradingResults.length > 0 && (
          <button onClick={() => setShowReport(true)} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
            <BarChart className="w-4 h-4" /> {t('grad_report_btn')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">{t('grad_step1')}</h2>
            </div>
            <div className="p-4">
              <textarea value={keysInput} onChange={(e) => setKeysInput(e.target.value.toUpperCase())} placeholder={`A AAACBCAD\nB BBBCBCAD\nC ABABABAB\n(Type 'V' for a voided question)`} className="w-full h-32 font-mono text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[500px]">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">{t('grad_step2')}</h2>
              <button onClick={() => { setStudentsInput(''); setKeysInput(''); }} className="text-xs flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"><Trash2 className="w-3 h-3" /> {t('grad_clear')}</button>
            </div>
            <div className="flex-1 p-0 relative">
              <textarea value={studentsInput} onChange={(e) => setStudentsInput(e.target.value)} placeholder={`John Smith A AAACBCAD\nJane Doe B BBBCBCAD\n(Use '-' or 'X' for skipped questions)`} className="w-full h-full p-4 font-mono text-sm resize-none focus:ring-0 border-none outline-none" spellCheck={false} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px] flex flex-col">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 sticky top-0 z-10">
              <h2 className="font-semibold text-gray-700">{t('grad_step3')}</h2>
            </div>
            <div className="p-4 space-y-4">
              {Object.keys(parsedKeys).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400"><AlertCircle className="w-12 h-12 mb-2 opacity-20" /><p>{t('grad_empty_keys')}</p></div>
              ) : gradingResults.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 text-gray-400"><RefreshCw className="w-12 h-12 mb-2 opacity-20" /><p>{t('grad_empty_stud')}</p></div>
              ) : (
                <div className="space-y-4">
                  {gradingResults.map((result, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                      {result.error ? (
                        <div className="flex items-center gap-2 text-red-500"><AlertCircle className="w-4 h-4" /><span className="text-sm font-medium">{result.error}</span><span className="text-xs text-gray-400 ml-2 font-mono truncate">{result.originalLine}</span></div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-gray-800 flex items-center gap-2">{result.name}<span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-bold border border-gray-200">Ver {result.version}</span></h3>
                              <div className="text-xs text-gray-500 font-mono mt-1 tracking-wider opacity-70 truncate max-w-[200px]">{result.answers}</div>
                            </div>
                            <div className="text-right">
                              {/* Display score allowing for 2 decimal places if negative marking is applied */}
                              <div className="text-2xl font-bold text-indigo-600">{result.score}<span className="text-sm text-gray-400 font-normal">/{result.totalQuestions}</span></div>
                              <div className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${result.percentage >= 80 ? 'bg-green-100 text-green-700' : result.percentage >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{result.percentage}%</div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {result.comparison.map((item, i) => (
                              <div key={i} className="flex flex-col items-center group relative">
                                <div className={`w-6 h-8 flex items-center justify-center rounded text-xs font-bold select-none cursor-help 
                                  ${item.isVoid ? 'bg-indigo-500 text-white' : item.isSkipped ? 'bg-gray-200 text-gray-500' : item.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} 
                                  ${item.isSkipped ? 'border border-gray-300' : ''}`}>
                                  {item.studentChar}
                                </div>
                                
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                  {item.isVoid 
                                    ? t('tooltip_void') 
                                    : item.isSkipped 
                                      ? t('tooltip_skipped')
                                      : !item.isCorrect 
                                        ? `${t('tooltip_exp')} ${item.keyChar} ${isNegativeMarking ? `(-${penalty})` : ''}` 
                                        : ''}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            {result.wrongQuestionNumbers.length > 0 ? (
                              <div className="flex items-start gap-2">
                                <span className="text-[10px] font-bold text-red-500 uppercase mt-1">{t('grad_wrong')}</span>
                                <div className="flex flex-wrap gap-1">
                                  {result.wrongQuestionNumbers.map(num => <span key={num} className="bg-red-50 text-red-700 border border-red-100 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">#{num}</span>)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-green-600 uppercase flex items-center gap-1"><Check className="w-3 h-3" /> {t('grad_perfect')}</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}