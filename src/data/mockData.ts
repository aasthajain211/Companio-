import { 
  ElderProfile, 
  ReminderItem, 
  MemoryMember, 
  ClassicSong, 
  SmartHomeDevice, 
  HealthVitalLog, 
  AshaWorker, 
  JanAushadhiKendraItem, 
  GenericMedicineItem, 
  TelemedicineDoc,
  ColorBellItem,
  WordPuzzleItem
} from '../types';

export const initialElderProfile: ElderProfile = {
  id: 'elder-01',
  name: 'राम प्रकाश शर्मा',
  nickname: 'राम प्रकाश जी (Ram Prakash Ji)',
  age: 76,
  stage: 2, // Moderate Simplified Mode
  highContrast: false,
  fontSize: 'large',
  language: 'hi',
  avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
  homeAddress: 'मकान नं. 42, शांति निकेतन, मॉडल टाउन, जयपुर',
  homeCoordinates: { lat: 26.9124, lng: 75.7873 },
  emergencyContacts: [
    {
      id: 'c1',
      name: 'Rohan Sharma (Son)',
      relation: 'बेटा (Son)',
      phone: '+91 98765 43210',
      isPrimary: true,
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'c2',
      name: 'Pooja Verma (Daughter)',
      relation: 'बेटी (Daughter)',
      phone: '+91 98234 56789',
      isPrimary: false,
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'c3',
      name: 'Dr. Alok Mathur (Physician)',
      relation: 'पारिवारिक डॉक्टर',
      phone: '+91 99112 33445',
      isPrimary: false,
      photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    },
  ],
  bloodGroup: 'B+ Positive',
  allergies: ['Penicillin', 'Dust Allergies'],
};

export const initialReminders: ReminderItem[] = [
  {
    id: 'r1',
    title: 'Morning Sugar & BP Medicine',
    titleHindi: 'सुबह की शुगर और बीपी की दवा (Telma 40 + Glycomet)',
    category: 'med',
    time: '08:30 AM',
    period: 'Morning',
    dosage: '1 Green tablet + 1 White small tablet with warm water',
    instructions: 'Take 15 minutes before breakfast.',
    instructionsHindi: 'नाश्ते से 15 मिनट पहले गुनगुने पानी के साथ लें।',
    recordedBy: 'रोहन (बेटा)',
    audioPromptText: 'दादाजी, सुबह की शुगर और बीपी की गोली पानी के साथ ले लीजिए।',
    takenToday: true,
    takenAt: '08:35 AM',
    iconName: 'Pill',
    pillColor: 'bg-emerald-600',
  },
  {
    id: 'r2',
    title: 'Warm Water & Hydration',
    titleHindi: 'गुनगुना पानी पिएं (1 बड़ा गिलास)',
    category: 'water',
    time: '11:00 AM',
    period: 'Morning',
    dosage: '1 Full Glass',
    instructions: 'Stay hydrated for digestion and energy.',
    instructionsHindi: 'शरीर में ताजगी और पाचन के लिए पानी जरूरी है।',
    recordedBy: 'अनन्या (पोती)',
    audioPromptText: 'दादाजी, पानी का गिलास टेबल पर रखा है, पूरा पी लीजिए!',
    takenToday: false,
    iconName: 'Droplet',
    pillColor: 'bg-sky-500',
  },
  {
    id: 'r3',
    title: 'Post Lunch Heart & Calcium Tablet',
    titleHindi: 'दोपहर के खाने के बाद: Shelcal HD + Ecosprin',
    category: 'med',
    time: '01:30 PM',
    period: 'Afternoon',
    dosage: '1 White Capsule',
    instructions: 'Take right after lunch with curd or water.',
    instructionsHindi: 'दाल-रोटी खाने के तुरंत बाद लें।',
    recordedBy: 'पूजा (बेटी)',
    audioPromptText: 'पापाजी, दोपहर का खाना हो गया हो तो कैल्शियम की गोली ले लें।',
    takenToday: false,
    iconName: 'Pill',
    pillColor: 'bg-amber-600',
  },
  {
    id: 'r4',
    title: 'Evening Garden Walk',
    titleHindi: 'शाम की खुली हवा में सैर (15 मिनट)',
    category: 'walk',
    time: '05:30 PM',
    period: 'Evening',
    dosage: '15 Minutes Walking in Lawn',
    instructions: 'Wear comfortable walking slippers.',
    instructionsHindi: 'बरामदे या लॉन में आरामदायक चप्पलों के साथ धीरे-धीरे टहलें।',
    recordedBy: 'कबीर (पोता)',
    audioPromptText: 'दादाजी, शाम हो गई है! चलिए बालकनी में थोड़ा टहल आते हैं।',
    takenToday: false,
    iconName: 'Footprints',
    pillColor: 'bg-emerald-500',
  },
  {
    id: 'r5',
    title: 'Night Memory & Cholesterol Tablet',
    titleHindi: 'रात की दवा: Atorvastatin 10mg',
    category: 'med',
    time: '09:00 PM',
    period: 'Night',
    dosage: '1 Small Pink Tablet',
    instructions: 'Take before sleeping with milk or water.',
    instructionsHindi: 'सोने से पहले एक घूंट दूध या पानी के साथ लें।',
    recordedBy: 'रोहन (बेटा)',
    audioPromptText: 'दादाजी, सोने का समय हो गया, रात की गोली खा लीजिए और आराम से सोइए।',
    takenToday: false,
    iconName: 'Moon',
    pillColor: 'bg-indigo-600',
  },
];

export const initialMemoryMembers: MemoryMember[] = [
  {
    id: 'mem1',
    name: 'रोहन शर्मा (Rohan)',
    relation: 'बेटा (Elder Son)',
    relationHindi: 'बड़ा बेटा - जो सॉफ्टवेयर इंजीनियर है और हर शाम फोन करता है',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    voiceMessageText: 'नमस्ते पापाजी! मैं रोहन हूँ। आज शाम को 7 बजे आपको वीडियो कॉल करूँगा। आप अपनी दवाई समय पर ले लेना!',
    storyCues: [
      'रोहन आपका बड़ा बेटा है जो IIT दिल्ली से पढ़ा है।',
      'उसे आपकी बनाई हुई बेसन की कढ़ी बहुत पसंद है।',
      'हर रविवार को आपको सुबह कॉल करके पुरानी बातें करता है।'
    ],
    phoneNumber: '+91 98765 43210',
    lastVisited: 'Yesterday'
  },
  {
    id: 'mem2',
    name: 'पूजा वर्मा (Pooja)',
    relation: 'बेटी (Daughter)',
    relationHindi: 'लाडली बेटी - जो स्कूल में गणित की टीचर है',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    voiceMessageText: 'पापाजी, प्रणाम! मैं पूजा। कल रविवार को मैं आपके लिए मनपसंद गाजर का हलवा बनाकर आऊँगी।',
    storyCues: [
      'पूजा आपकी सबसे प्यारी बेटी है।',
      'बचपन में आपके साथ स्कूटर पर बैठकर स्कूल जाया करती थी।',
      'उसके दो बच्चे हैं - अनन्या और आरव।'
    ],
    phoneNumber: '+91 98234 56789',
    lastVisited: '3 days ago'
  },
  {
    id: 'mem3',
    name: 'अनन्या (Ananya)',
    relation: 'पोती (Granddaughter)',
    relationHindi: 'आपकी 10 साल की पोती - जो बहुत होशियार और नटखट है',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    voiceMessageText: 'दादू! आज मैंने स्कूल में ड्राइंग कॉम्पीटिशन में फर्स्ट प्राइज जीता! शाम को आपको दिखाऊँगी!',
    storyCues: [
      'अनन्या रोहन की बेटी है।',
      'वह आपके साथ लूडो और कैरम खेलना सबसे ज्यादा पसंद करती है।',
      'वह आपको हमेशा "प्यारे दादू" कहकर गले लगाती है।'
    ],
    lastVisited: 'Today morning'
  },
  {
    id: 'mem4',
    name: 'सरस्वती देवी (Saraswati Ji)',
    relation: 'धर्मपत्नी (Loving Wife)',
    relationHindi: 'आपकी जीवनसंगिनी - 50 वर्षों का अटूट और सुंदर साथ',
    photoUrl: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?auto=format&fit=crop&w=400&q=80',
    voiceMessageText: 'शर्मा जी, तुलसी के पौधे में जल दे दिया है। आप भी धूप में 10 मिनट बैठ जाइए।',
    storyCues: [
      '1974 में आपकी शादी जयपुर में हुई थी।',
      'आप दोनों को एक साथ शाम को चाय पीना और लता जी के गाने सुनना बहुत पसंद है।',
      'वे हमेशा आपके स्वास्थ्य का पूरा ध्यान रखती हैं।'
    ],
    lastVisited: 'Always with you at home'
  },
  {
    id: 'mem5',
    name: 'कबीर (Kabir)',
    relation: 'पोता (Grandson)',
    relationHindi: 'छोटा पोता - जो क्रिकेट का दीवाना है',
    photoUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=400&q=80',
    voiceMessageText: 'दादाजी, आज मैच में मैंने 3 चौके मारे! आप शाम को मुझे अपनी जवानी के क्रिकेट के किस्से सुनाइएगा!',
    storyCues: [
      'कबीर 12 साल का है और बहुत तेज दौड़ता है।',
      'आप उसे बचपन में पार्क में क्रिकेट बैटिंग सिखाते थे।'
    ],
    lastVisited: '2 days ago'
  }
];

export const initialFamilyMembers = initialMemoryMembers;

export const initialAudioDiaries = [
  {
    id: 'ad1',
    date: '2026-08-25',
    time: '07:30 PM',
    durationSeconds: 32,
    transcriptHindi: 'आज शाम को अनन्य के साथ कैरम खेला और मैंने उसे पुरानी जयपुर वाली हवेली की कहानी सुनाई। बहुत खुशी हुई।',
    moodSummary: 'खुश और संतुष्ट (Warm & Joyful)',
    sentiment: 'Happy',
    sentimentScore: 95
  },
  {
    id: 'ad2',
    date: '2026-08-24',
    time: '08:00 PM',
    durationSeconds: 28,
    transcriptHindi: 'आज मौसम बहुत सुहावना था। बालकनी में बैठकर पुराने गाने सुने और गरम अदरक वाली चाय पी।',
    moodSummary: 'शांत व सुकून (Peaceful)',
    sentiment: 'Peaceful',
    sentimentScore: 88
  }
];

export const initialDoctorNotes = [
  {
    id: 'dn1',
    doctorName: 'Dr. Alok Mathur (Senior Geriatrician)',
    date: '2026-08-24',
    note: 'मरीज का रक्तचाप और फास्टिंग शुगर दोनों बहुत अच्छे नियंत्रण में हैं। नियमित सुबह की सैर जारी रखें।',
    priority: 'normal' as const,
    acknowledgedByCaregiver: true
  },
  {
    id: 'dn2',
    doctorName: 'Dr. Sunita Rao (Cardiologist)',
    date: '2026-08-20',
    note: 'नमक की मात्रा भोजन में संतुलित रखें और दोपहर को भोजन के बाद 20 मिनट का आराम अवश्य लें।',
    priority: 'normal' as const,
    acknowledgedByCaregiver: true
  }
];

export const initialEmotionLogs = [
  {
    id: 'el1',
    date: '2026-08-25',
    time: '04:15 PM',
    userUtterance: 'आज मुझे सब बहुत अच्छा लग रहा है, बच्चों से बात हो गई।',
    detectedEmotion: 'Happy & Connected',
    sentimentScore: 92,
    aiAnalysis: 'सकारात्मक और पारिवारिक जुड़ाव महसूस हो रहा है।'
  },
  {
    id: 'el2',
    date: '2026-08-24',
    time: '02:30 PM',
    userUtterance: 'थोड़ी देर के लिए भूल गया था कि चश्मा कहाँ रखा है, पर मिल गया।',
    detectedEmotion: 'Mild Anxiety / Relieved',
    sentimentScore: 78,
    aiAnalysis: 'हल्की विस्मृति के बाद तुरंत सामान्य और शांत स्थिति।'
  }
];

export const initialSongs: ClassicSong[] = [
  {
    id: 's1',
    title: 'ये शाम मस्तानी (Yeh Shaam Mastani)',
    artist: 'Kishore Kumar (Kati Patang, 1971)',
    era: '1970s Golden Era',
    moodTag: 'Calm',
    raag: 'राग बिलावल (Raag Bilawal)',
    durationSeconds: 260,
    audioSnippetUrl: 'https://cdn.freesound.org/previews/563/563820_11861866-lq.mp3',
    lyricsSnippet: 'ये शाम मस्तानी मदहोश किये जाए, मुझे डोर कोई खींचे तेरी ओर लिये जाए...',
    fullLyrics: [
      'ये शाम मस्तानी मदहोश किये जाए',
      'मुझे डोर कोई खींचे तेरी ओर लिये जाए',
      'दूर रहती है तू, मेरे पास आती नहीं',
      'होठों पे तेरे कभी प्यास आती नहीं'
    ],
    singerStoryHindi: '1971 में फिल्म कटी पतंग का यह सदाबहार गीत राजेश खन्ना और आशा पारेख पर फिल्माया गया था। आर. डी. बर्मन का संगीत और किशोर दा की जादुई सीटी आज भी कानों में मिश्री घोल देती है।',
    coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 's2',
    title: 'लग जा गले (Lag Ja Gale)',
    artist: 'Lata Mangeshkar (Woh Kaun Thi, 1964)',
    era: '1960s Classic Melodies',
    moodTag: 'Nostalgic',
    raag: 'राग भैरवी व पहाड़ी (Raag Bhairavi)',
    durationSeconds: 250,
    audioSnippetUrl: 'https://cdn.freesound.org/previews/415/415804_5121236-lq.mp3',
    lyricsSnippet: 'लग जा गले कि फिर ये हसीं रात हो न हो, शायद फिर इस जनम में मुलाकात हो न हो...',
    fullLyrics: [
      'लग जा गले कि फिर ये हसीं रात हो न हो',
      'शायद फिर इस जनम में मुलाकात हो न हो',
      'हमको मिली हैं आज ये घड़ियाँ नसीब से',
      'जी भर के देख लीजिए हमको क़रीब से'
    ],
    singerStoryHindi: 'मदन मोहन जी की बनाई यह अमर धुन और लता दीदी का भावुक स्वर हर भारतीय के दिल को छू लेता है। साधना जी पर फिल्माया गया यह गीत 1964 की मिस्ट्री थ्रिलर फिल्म "वो कौन थी" का है।',
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 's3',
    title: 'अच्युतम केशवं कृष्ण दामोदरं (Achyutam Keshavam)',
    artist: 'Calming Krishna Bhajan (Devotional Flute)',
    era: 'Spiritual Peace',
    moodTag: 'Devotional',
    raag: 'राग कल्याण / यमन (Raag Yaman)',
    durationSeconds: 310,
    audioSnippetUrl: 'https://cdn.freesound.org/previews/612/612611_5674468-lq.mp3',
    lyricsSnippet: 'अच्युतम केशवं कृष्ण दामोदरं, राम नारायणं जानकी वल्लभम्...',
    fullLyrics: [
      'अच्युतम केशवं कृष्ण दामोदरं',
      'राम नारायणं जानकी वल्लभम्',
      'कौन कहते हैं भगवान आते नहीं',
      'तुम मीरा के जैसे बुलाते नहीं'
    ],
    singerStoryHindi: 'भगवान श्री कृष्ण का अत्यंत पवित्र और मन को शांति देने वाला भजन। बांसुरी और तानपूरे की मंद ध्वनि सुबह की प्रार्थना और शाम के ध्यान के लिए सर्वश्रेष्ठ मानी जाती है।',
    coverArt: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 's4',
    title: 'बाबूमोशाय - ज़िन्दगी कैसी है पहेली (Zindagi Kaisi Hai)',
    artist: 'Manna Dey (Anand, 1971)',
    era: '1970s Masterpiece',
    moodTag: 'Joyful',
    raag: 'राग खमाज (Raag Khamaj)',
    durationSeconds: 220,
    audioSnippetUrl: 'https://cdn.freesound.org/previews/450/450849_5121236-lq.mp3',
    lyricsSnippet: 'ज़िंदगी कैसी है पहेली हाये, कभी तो हँसाये कभी ये रुलाये...',
    fullLyrics: [
      'ज़िंदगी कैसी है पहेली हाये',
      'कभी तो हँसाये कभी ये रुलाये',
      'कभी देखो मन मीत अनजाने चेहरों से',
      'जाए मिले यहाँ सपनों के सेहरों में'
    ],
    singerStoryHindi: 'हृषिकेश मुखर्जी की फिल्म "आनंद" में मन्ना डे साहब का यह दार्शनिक गीत जिंदगी की सुंदरता और हर पल को खुशी से जीने का संदेश देता है।',
    coverArt: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 's5',
    title: 'रघुपति राघव राजा राम (Raghupati Raghav)',
    artist: 'Peaceful Morning Dhun (Santoor & Sitar)',
    era: 'Spiritual Morning',
    moodTag: 'Devotional',
    raag: 'राग भूपाली (Raag Bhupali)',
    durationSeconds: 280,
    audioSnippetUrl: 'https://cdn.freesound.org/previews/387/387232_1474204-lq.mp3',
    lyricsSnippet: 'रघुपति राघव राजा राम, पतित पावन सीता राम...',
    fullLyrics: [
      'रघुपति राघव राजा राम',
      'पतित पावन सीता राम',
      'ईश्वर अल्लाह तेरो नाम',
      'सबको सन्मति दे भगवान'
    ],
    singerStoryHindi: 'महात्मा गांधी जी का सर्वाधिक प्रिय भजन। संतूर की मधुर झंकार के साथ यह धुन मन में सकारात्मक ऊर्जा और आध्यात्मिक शांति का संचार करती है।',
    coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 's6',
    title: 'चूरा लिया है तुमने जो दिल को (Chura Liya Hai)',
    artist: 'Asha Bhosle & Mohd. Rafi (1973)',
    era: '1970s Romance',
    moodTag: 'Joyful',
    raag: 'राग शिवरंजनी (Raag Shivaranjani)',
    durationSeconds: 240,
    audioSnippetUrl: 'https://cdn.freesound.org/previews/415/415804_5121236-lq.mp3',
    lyricsSnippet: 'चुरा लिया है तुमने जो दिल को, नज़र नहीं चुराना सनम...',
    fullLyrics: [
      'चुरा लिया है तुमने जो दिल को',
      'नज़र नहीं चुराना सनम',
      'बदल के मेरी तुम ज़िंदगानी',
      'कहीं बदल ना जाना सनम'
    ],
    singerStoryHindi: 'फिल्म "यादों की बारात" का यह सदाबहार गीत कांच के गिलास पर चम्मच बजाने की अनोखी धुन से शुरू होता है। जीनत अमान और विजय अरोड़ा की केमिस्ट्री आज भी याद की जाती है।',
    coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80'
  }
];

export const colorBellsData = [
  {
    id: 0,
    name: 'Sunhara (Gold)',
    nameHindi: 'सा (Sa) • सुनहरा',
    note: 'सा (Sa)',
    colorClass: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    activeColorClass: 'bg-amber-300 ring-8 ring-amber-300/60 scale-105 shadow-2xl',
    borderClass: 'border-amber-400',
    freq: 261.63 // C4
  },
  {
    id: 1,
    name: 'Panna (Green)',
    nameHindi: 'रे (Re) • पन्ना हरा',
    note: 'रे (Re)',
    colorClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    activeColorClass: 'bg-emerald-300 ring-8 ring-emerald-300/60 scale-105 shadow-2xl',
    borderClass: 'border-emerald-400',
    freq: 329.63 // E4
  },
  {
    id: 2,
    name: 'Neelam (Blue)',
    nameHindi: 'ग (Ga) • नीलम नीला',
    note: 'ग (Ga)',
    colorClass: 'bg-sky-600 hover:bg-sky-500 text-white',
    activeColorClass: 'bg-sky-300 ring-8 ring-sky-300/60 scale-105 shadow-2xl',
    borderClass: 'border-sky-400',
    freq: 392.00 // G4
  },
  {
    id: 3,
    name: 'Manik (Ruby)',
    nameHindi: 'प (Pa) • माणिक लाल',
    note: 'प (Pa)',
    colorClass: 'bg-rose-600 hover:bg-rose-500 text-white',
    activeColorClass: 'bg-rose-300 ring-8 ring-rose-300/60 scale-105 shadow-2xl',
    borderClass: 'border-rose-400',
    freq: 523.25 // C5
  }
];

export const initialWordPuzzles = [
  {
    id: 'wp1',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    category: 'स्मृति व संस्कृति (Heritage)',
    answerHindi: 'दीया',
    answerEnglish: 'DIYA',
    hintHindi: 'दीपावली और पूजा में जलने वाला मिट्टी का पवित्र दीपक',
    factHindi: 'दीया सकारात्मक ऊर्जा और अंधकार पर प्रकाश की विजय का प्रतीक है।',
    scrambledLetters: ['दी', 'पा', 'या', 'क', 'ल']
  },
  {
    id: 'wp2',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    category: 'संगीत व वाद्य (Music)',
    answerHindi: 'सितार',
    answerEnglish: 'SITAR',
    hintHindi: 'पंडित रविशंकर जी का प्रसिद्ध भारतीय शास्त्रीय वाद्य यंत्र',
    factHindi: 'सितार में मुख्य रूप से 18 से 21 तार होते हैं और यह रागों की मधुरता बढ़ाता है।',
    scrambledLetters: ['सि', 'ता', 'र', 'म', 'न']
  },
  {
    id: 'wp3',
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=400&q=80',
    category: 'रसीले फल (Fruits)',
    answerHindi: 'आम',
    answerEnglish: 'AAM (Mango)',
    hintHindi: 'फलों का राजा - अल्फांसो और दशहरी की मीठी सुगंध',
    factHindi: 'आम भारत का राष्ट्रीय फल है और गर्मियों में सबका पसंदीदा होता है।',
    scrambledLetters: ['आ', 'म', 'क', 'ल']
  },
  {
    id: 'wp4',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
    category: 'दैनिक दिनचर्या (Daily Life)',
    answerHindi: 'चाय',
    answerEnglish: 'CHAI',
    hintHindi: 'सुबह की ताजगी और अदरक-इलायची की महक वाली चुस्की',
    factHindi: 'भारत में सुबह की चाय परिवार के साथ बातचीत का सबसे सुंदर बहाना है।',
    scrambledLetters: ['चा', 'य', 'पा', 'दू']
  }
];

export const initialSmartHomeDevices: SmartHomeDevice[] = [
  {
    id: 'dev1',
    name: 'Bedroom Warm Light (कमरे की लाइट)',
    nameHindi: 'बेडरूम की आरामदायक पीली लाइट (2700K)',
    room: 'Bedroom',
    type: 'light',
    isOn: true,
    value: '70% Warm Amber',
    scheduleDescription: 'Auto dims to warm sleep mode at 08:30 PM',
    icon: 'SunMedium'
  },
  {
    id: 'dev2',
    name: 'Hallway Safe Night-Path (रात का सुरक्षित रास्ता)',
    nameHindi: 'रात में बाथरूम जाने के रास्ते की मोशन सेंसर लाइट',
    room: 'Hallway / Corridor',
    type: 'nightlight',
    isOn: true,
    value: 'Motion Auto-Sense Enabled',
    scheduleDescription: 'Automatically lights up gently if movement detected at night',
    icon: 'Moon'
  },
  {
    id: 'dev3',
    name: 'Living Room Ceiling Fan (छत का पंखा)',
    nameHindi: 'कमरे का पंखा (गति 3)',
    room: 'Living Room',
    type: 'fan',
    isOn: true,
    value: 'Speed 3 (Gentle Breeze)',
    scheduleDescription: 'Maintains optimal 24°C room breeze',
    icon: 'Wind'
  },
  {
    id: 'dev4',
    name: 'Bathroom Water Geyser (गर्म पानी का गीजर)',
    nameHindi: 'स्नान के लिए गर्म पानी का गीजर',
    room: 'Master Bathroom',
    type: 'geyser',
    isOn: false,
    value: 'Off (Turns on 6:30 AM)',
    scheduleDescription: 'Auto schedules for 30 mins before morning bath',
    icon: 'Flame'
  }
];

export const initialSmartDevices = initialSmartHomeDevices;

export const initialHealthVitals: HealthVitalLog[] = [
  {
    id: 'v1',
    date: '2026-08-25',
    time: '08:00 AM',
    bpSystolic: 124,
    bpDiastolic: 82,
    bloodSugarFasting: 108,
    pulseRate: 74,
    sleepHours: 7.5,
    moodRating: 5,
    adherencePercentage: 100,
    loggedBy: 'Caregiver',
    notes: 'Very cheerful morning. Completed morning walk with grandson.'
  },
  {
    id: 'v2',
    date: '2026-08-24',
    time: '08:15 AM',
    bpSystolic: 128,
    bpDiastolic: 84,
    bloodSugarFasting: 114,
    pulseRate: 76,
    sleepHours: 7.0,
    moodRating: 4,
    adherencePercentage: 100,
    loggedBy: 'Patient',
    notes: 'Good appetite. Listened to Kishore Kumar songs.'
  },
  {
    id: 'v3',
    date: '2026-08-23',
    time: '08:00 AM',
    bpSystolic: 130,
    bpDiastolic: 86,
    bloodSugarFasting: 118,
    pulseRate: 78,
    sleepHours: 6.8,
    moodRating: 4,
    adherencePercentage: 90,
    loggedBy: 'ASHA Worker',
    notes: 'ASHA worker Rekha Devi conducted weekly routine check.'
  },
  {
    id: 'v4',
    date: '2026-08-22',
    time: '08:30 AM',
    bpSystolic: 126,
    bpDiastolic: 82,
    bloodSugarFasting: 110,
    pulseRate: 72,
    sleepHours: 7.2,
    moodRating: 5,
    adherencePercentage: 100,
    loggedBy: 'Caregiver',
    notes: 'Stable parameters.'
  },
  {
    id: 'v5',
    date: '2026-08-21',
    time: '08:10 AM',
    bpSystolic: 132,
    bpDiastolic: 88,
    bloodSugarFasting: 122,
    pulseRate: 80,
    sleepHours: 6.5,
    moodRating: 3,
    adherencePercentage: 85,
    loggedBy: 'Caregiver',
    notes: 'Mild fatigue due to weather change. Extra water given.'
  }
];

export const initialAshaWorker: AshaWorker = {
  id: 'asha-01',
  name: 'रेखा देवी (Rekha Devi)',
  villageWard: 'वार्ड 14, मॉडल टाउन प्राथमिक स्वास्थ्य उप-केंद्र',
  phone: '+91 94140 88990',
  subCenter: 'Primary Health Center (PHC) Model Town',
  photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  nextScheduledVisit: '28 Aug 2026 (शुक्रवार सुबह 10:30 AM)',
  recentVitalsReviewed: true,
  emergencyHelpline: '104 (राष्ट्रीय स्वास्थ्य हेल्पलाइन) / 108 (एम्बुलेंस)'
};

export const initialJanAushadhiKendras: JanAushadhiKendraItem[] = [
  {
    id: 'kendra-1',
    name: 'प्रधानमंत्री भारतीय जन औषधि केंद्र - मॉडल टाउन',
    address: 'दुकान नं. 12, कम्युनिटी सेंटर के पास, मॉडल टाउन, जयपुर',
    distanceKm: 0.6,
    phone: '+91 94142 55670',
    timings: '08:00 AM - 09:30 PM (खुला है)',
    rating: 4.8,
    lat: 26.9140,
    lng: 75.7890,
    availableStockCount: 1420
  },
  {
    id: 'kendra-2',
    name: 'PM Jan Aushadhi Store - मानसरोवर चौराहा',
    address: 'प्लॉट नं. 5, मेट्रो पिलर 45 के सामने, मानसरोवर',
    distanceKm: 1.8,
    phone: '+91 98290 11223',
    timings: '08:30 AM - 10:00 PM (खुला है)',
    rating: 4.7,
    lat: 26.9080,
    lng: 75.7750,
    availableStockCount: 1850
  },
  {
    id: 'kendra-3',
    name: 'Govt Jan Aushadhi Medical Unit - PHC परिसर',
    address: 'सरकारी अस्पताल गेट नं 2, राजा पार्क',
    distanceKm: 3.2,
    phone: '+91 94133 44556',
    timings: '24 Hours Emergency Counter',
    rating: 4.9,
    lat: 26.9200,
    lng: 75.8050,
    availableStockCount: 2200
  }
];

export const initialGenericMedicines: GenericMedicineItem[] = [
  {
    id: 'gen-1',
    brandedName: 'Telma 40 / Telmikind 40',
    brandedCompany: 'Glenmark / Mankind',
    genericSalt: 'Telmisartan Tablets IP 40mg',
    brandedPrice10Tablets: 110,
    janAushadhiPrice10Tablets: 14,
    savingsPercentage: 87,
    category: 'Blood Pressure / Hypertension (बीपी)',
    janAushadhiCode: 'PMBJP-CARD-042',
    inStock: true,
    dosageAdvice: 'Take 1 tablet daily morning after breakfast.'
  },
  {
    id: 'gen-2',
    brandedName: 'Glycomet GP 2 / Amaryl M2',
    brandedCompany: 'USV / Sanofi',
    genericSalt: 'Glimepiride 2mg + Metformin Hydrochloride 500mg (SR)',
    brandedPrice10Tablets: 215,
    janAushadhiPrice10Tablets: 26,
    savingsPercentage: 88,
    category: 'Diabetes Care (शुगर नियंत्रण)',
    janAushadhiCode: 'PMBJP-DIAB-118',
    inStock: true,
    dosageAdvice: 'Take with morning meal as directed.'
  },
  {
    id: 'gen-3',
    brandedName: 'Shelcal HD / Shelcal 500',
    brandedCompany: 'Torrent Pharma',
    genericSalt: 'Calcium Carbonate 500mg + Vitamin D3 250 IU',
    brandedPrice10Tablets: 135,
    janAushadhiPrice10Tablets: 18,
    savingsPercentage: 86,
    category: 'Bone & Joint Health (हड्डियों की ताकत)',
    janAushadhiCode: 'PMBJP-VIT-089',
    inStock: true,
    dosageAdvice: 'Take 1 tablet after lunch with water.'
  },
  {
    id: 'gen-4',
    brandedName: 'Pan-D / Pantocid-DSR',
    brandedCompany: 'Alkem / Sun Pharma',
    genericSalt: 'Pantoprazole 40mg + Domperidone 30mg SR',
    brandedPrice10Tablets: 198,
    janAushadhiPrice10Tablets: 22,
    savingsPercentage: 89,
    category: 'Acidity & Gas Relief (गैस और एसिडिटी)',
    janAushadhiCode: 'PMBJP-GAST-204',
    inStock: true,
    dosageAdvice: 'Take empty stomach in the morning 30 mins before tea.'
  },
  {
    id: 'gen-5',
    brandedName: 'Atorva 10 / Lipitor 10',
    brandedCompany: 'Zydus / Pfizer',
    genericSalt: 'Atorvastatin Calcium Tablets 10mg',
    brandedPrice10Tablets: 145,
    janAushadhiPrice10Tablets: 16,
    savingsPercentage: 89,
    category: 'Cholesterol & Heart Health (कोलेस्ट्रॉल)',
    janAushadhiCode: 'PMBJP-CARD-091',
    inStock: true,
    dosageAdvice: 'Take 1 tablet at night before sleep.'
  },
  {
    id: 'gen-6',
    brandedName: 'Refresh Tears / Refresh Liquigel',
    brandedCompany: 'Allergan',
    genericSalt: 'Carboxymethylcellulose Sodium Eye Drops 0.5%',
    brandedPrice10Tablets: 180,
    janAushadhiPrice10Tablets: 28,
    savingsPercentage: 84,
    category: 'Eye Care Lubricant (आँखों में सूखापन)',
    janAushadhiCode: 'PMBJP-OPHT-012',
    inStock: true,
    dosageAdvice: 'Put 1-2 drops in both eyes twice a day.'
  }
];

export const initialTelemedicineDoctors: TelemedicineDoc[] = [
  {
    id: 'doc-1',
    name: 'Dr. Alok Mathur',
    specialty: 'Senior Geriatrician & General Physician',
    degree: 'MBBS, MD (Geriatric Medicine, AIIMS)',
    experienceYears: 22,
    availableTime: 'Available Today (10:00 AM - 01:00 PM)',
    consultationFeeINR: 400,
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    languages: ['Hindi', 'English', 'Rajasthani'],
    rating: 4.9
  },
  {
    id: 'doc-2',
    name: 'Dr. Sunita Rao',
    specialty: 'Senior Cardiologist & Hypertension Specialist',
    degree: 'MBBS, DM (Cardiology, PGIMER)',
    experienceYears: 18,
    availableTime: 'Available Today (04:00 PM - 07:00 PM)',
    consultationFeeINR: 500,
    photoUrl: 'https://images.unsplash.com/photo-1594824813588-4464534f59c8?auto=format&fit=crop&w=400&q=80',
    languages: ['Hindi', 'English'],
    rating: 4.9
  },
  {
    id: 'doc-3',
    name: 'Dr. Ramesh Verma',
    specialty: 'Diabetologist & Internal Medicine',
    degree: 'MBBS, MD (Medicine), Fellowship in Diabetology',
    experienceYears: 15,
    availableTime: 'Available Tomorrow (11:00 AM - 02:00 PM)',
    consultationFeeINR: 350,
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    languages: ['Hindi', 'English'],
    rating: 4.8
  }
];
