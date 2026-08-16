export type Message = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

export type Contact = {
  id: string;
  name: string;
  verified?: boolean;
  online?: boolean;
  avatar: string;
  compatibility: number;
  lastMessage: string;
  when: string;
  unread?: number;
};

export const contacts: Contact[] = [
  {
    id: "jessica",
    name: "Jessica M.",
    verified: true,
    online: true,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwOKVIiy7gTJRggR4PflQy6UCHadXPQj28P2gPK5XI6FTM90t6KOLLCxJNOIIpfgZrjEOsuv3lZkXE5M0lF6qYnPp-5GIMkM-eiVdsDcsNJTRpr53DEf7_K4enNEekE3zEOQftxMEuE9wDtkxwKhAv_LI29A-LEIZwMxFXhgfp2WLDDWAbdgsE_gt7_TQTkv-nFDif7LmP6eFyUyRSQIlrvblsqyWtYv5wQZuxC_IUeGCnPVJBbHpB",
    compatibility: 94,
    lastMessage: "Hey! Did you want to schedule a tour for the place in downtown?",
    when: "Today",
    unread: 1,
  },
  {
    id: "michael",
    name: "Michael Chen",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYmk1tNDBrPzf708ZTRwjKLUb20qgAeTIoqiU517NySIyrUYhEGL24pJAFvRBRrmfqV2RpMRJ_rs8SIQ9csDJOhEcGXeVWdn_LL2FeF0ov2Rgw-hG8FSKSOCtJb0YoFG5NXBVq5vbflG-O0AaExEraFqmxty5kleM3E4o6FNyRTh9S90RP0q0C6e3Fkk-FFuZYqJ55K_OWbhpG-QFUgFIwQigdO-ZPT5ZkNoKb-YBGwVKPUomp31CQ",
    compatibility: 88,
    lastMessage: "Sounds good, let's talk about the lease terms tomorrow.",
    when: "Yesterday",
  },
  {
    id: "emily",
    name: "Emily R.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuASk8E2OAG2LcUA3JsUw2SIGfYRFBOzbEGPULBBNgvO40IsHXtk98ISk7DM4LW4dhyvn_9YGHm5VOY4UxeEuEHFVcVNctV5oGS9tRvkyLyY1Mn3Wdd_ocLmgiYfbU8G6C_MReMflQJaELDnVfqSFPOCJJYX9k8Yo9tA9jWb_Xu9dHnlzn04CvX-q_2nwN45Z9Juuqu4oL9ntBMMh--r8UyCnVTzNsEy-Xeh99GZtNJVwiCC2x8WunG0",
    compatibility: 75,
    lastMessage: "I have a golden retriever, is it pet friendly?",
    when: "Mon",
  },
];

export const mutualMatches = [
  {
    id: "sarah",
    name: "Sarah",
    isNew: true,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmbaCGXsVTxhi6EJ3d-zBilR8D5zp44kwqAEarhLyO1YuqAauUEaMi-FS7rbK4VEPNMFZQLyCveNIfuIptLDzyPfovOFau7BnJbevxJsqcY_9jVJypeZB3NQV8PYyEzYfZLVabIV2_etksCWOk9QopxAqp9qewS1NqokwLIJcwpRmlqUB6Sc4BnRwnGudqAQ9t7IGySIfFD085K_Ut5g0OVl6y8VP6QAN0TxmJ5QX33OdHyd55hVh-",
  },
  {
    id: "david",
    name: "David",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB69No9aY_ES4Q_aSYFKTNsX2lI9DBdZjveIED1UIP2xxCMVb1U-pCQofB11C-hDLLwPwScZ0e67GZu7qjMq2FywE7gy3kC6GyWQUHCGW-P43bsmQdMBmMC2Yc9vEs4lfnj38s2tpv7kPWAztdXZKPALVsbzKFBfYECHQBNQdgOObrUzbXsmlhvx89XSoITSvFlOh9k9aBdE61uaq6IoMO8SPKQQU77NuAcvhLKfEP3YJxCZANdOIlC",
  },
  {
    id: "alex",
    name: "Alex",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBvkLHg3NQBVmz0tS_vbFxsQRjjhQ8m-wZolRpJxCJd9R45uWmsihdFVHIBOqqvRsHSjg0YWTitRVQdr8mj0-NdU_bcPoDz19SEgUPMMbVeFPDW4iivxnbdqYwIMhTUmW3qzj2fO58kQs_5j-4p0VKx1fOzATNL6R0x6ZodkNyTPONayEUzcfX6iDP9HIdiY3J7pxb5Yp85CBVISqGtoQzlwgjTmnLSI8kt8dOghjruKQ6zva89VovR",
  },
];

export const conversations: Record<string, Message[]> = {
  jessica: [
    { id: "j1", from: "them", text: "Hi! I saw we matched at 94% — that's wild.", time: "9:12 AM" },
    { id: "j2", from: "me", text: "Haha right? Your place looks amazing.", time: "9:18 AM" },
    {
      id: "j3",
      from: "them",
      text: "Hey! Did you want to schedule a tour for the place in downtown?",
      time: "9:31 AM",
    },
  ],
  michael: [
    { id: "m1", from: "them", text: "Hey, are you still looking for a place?", time: "4:02 PM" },
    { id: "m2", from: "me", text: "Yes! Moving in around the 1st.", time: "4:20 PM" },
    { id: "m3", from: "them", text: "Sounds good, let's talk about the lease terms tomorrow.", time: "4:25 PM" },
  ],
  emily: [
    { id: "e1", from: "them", text: "Hi there, loved your profile!", time: "11:05 AM" },
    { id: "e2", from: "them", text: "I have a golden retriever, is it pet friendly?", time: "11:06 AM" },
  ],
};

export interface LifestyleItem {
  label: string;
  value: string;
  match: "Match" | "Okay";
  icon: string;
}

export type UserProfile = {
  id: string;
  name: string;
  age: number;
  location: string;
  rent: number;
  compatibility: number;
  photo: string;
  bio: string;
  interests: string[];
  lifestyle: LifestyleItem[];
  apartmentPhotos: string[];
  hasRoom: boolean;
  verified?: boolean;
};

export const userProfiles: UserProfile[] = [
  {
    id: "alex",
    name: "Alex",
    age: 26,
    location: "Downtown",
    rent: 1200,
    compatibility: 92,
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvAn89_4C3RstRpHXxpg9B254C55jqUsK778KDMxA5U9QGCVf5PSS1blzjGLsahSUHGaOQ1JqkhMSJP95zhMkOxPUJp5UeU8DbBZHzz56p2nvYGa-FFK28llExBPu3rliG0MBRBVtErXBYnHc1H9aU_Wxt7o-aa9_ybEo61Sj49g4N1gwpcyGbbX5Nf31ZrKkLA7YEaareQKP4zYFqAumJR4rrlFUsdwq8tqhyF1edHQfSGJTPoyFh",
    bio: "Looking for a chill spot near downtown. I cook on weekends and love plants. I appreciate a clean space but I'm not obsessive about it. Hoping to find a roommate who wants to hang out occasionally but respects quiet time.",
    interests: ["Coffee", "Hiking", "Gaming", "Yoga", "Plants"],
    lifestyle: [
      { label: "Sleep Schedule", value: "Night Owl", match: "Match", icon: "bedtime" },
      { label: "Cleanliness", value: "Tidy but relaxed", match: "Match", icon: "cleaning_services" },
      { label: "Social Level", value: "Friendly, values quiet", match: "Okay", icon: "groups" },
      { label: "Guests", value: "Weekends mostly", match: "Match", icon: "door_open" }
    ],
    apartmentPhotos: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC0gFVSnr3f5dzIf__CSvW-kRCXF6WXuh1tcG5ll5V_hXrXZ8NquByfXaQ0WvS9st4Hfzw9ygJW6mYSevZ-TduGAehFsBZfeGbmsQtz-VywleZ_fi_VeJWTlTzsm_eBq8rYUuzSRkHcM_vyyRPqZecLHTFhOIPeWbHr93isk8Io3S084R18I2DI0gS2dxmNmlgmjSU_r-r8J0KEcwvqkm1GaMF3TEv2j3qTgqWn0b2YJcF3Le49MKBt",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9B-0BwFOpFHqdoiGNuJfU4fFrWWgp6Uisi3y7bWniXvsyXjMAazsJJFkLwXCZ0c4JVjaYzPrZP0E7V9xPrHZfT_q-ioh8H4a4kivFoijdmJstRf8YAzBiIqtq2W23pSIc8zoGtqGviRIlucpCX8KC0Q45BhGE4dxy4YNRDoRB1C1xosBiw6cbIAAqXxI79maP9HQiP5hCrTfjW-jQHakTex2zmeB5K5w63r9Kp5FNvzldW0aGQb-0",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1oY4QBhzDECSjK98wFwQhXFWrxLDd5bBKpzCMjJtlxHtvUhAJ1Aa1p3dE90F5Zf2kNPq4GqMlsWGw_VBjCpQbS9jfLHmPqruFc2AByRgpKtU2HawMKdGvuzEqcjz9U1yDfmnUv10z45WKcPowC-86CDU6KMxgNvfVG2mPlRYzkz_xr9pDLZ-hcVHekViMWK5DJWlNGqTzluYmbY-y05bzgF58TiEm970Tt4JW6KHesMxOhJS1JgBU"
    ],
    hasRoom: true,
    verified: true
  },
  {
    id: "david",
    name: "David",
    age: 28,
    location: "North Beach",
    rent: 1350,
    compatibility: 85,
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB69No9aY_ES4Q_aSYFKTNsX2lI9DBdZjveIED1UIP2xxCMVb1U-pCQofB11C-hDLLwPwScZ0e67GZu7qjMq2FywE7gy3kC6GyWQUHCGW-P43bsmQdMBmMC2Yc9vEs4lfnj38s2tpv7kPWAztdXZKPALVsbzKFBfYECHQBNQdgOObrUzbXsmlhvx89XSoITSvFlOh9k9aBdE61uaq6IoMO8SPKQQU77NuAcvhLKfEP3YJxCZANdOIlC",
    bio: "Avid hiker and coffee enthusiast. I work hybrid as a graphic designer. I'm active on weekends, but love a quiet weekday evening. Let's find a cozy place together!",
    interests: ["Coffee", "Hiking", "Design", "Outdoors", "Music"],
    lifestyle: [
      { label: "Sleep Schedule", value: "Flexible", match: "Match", icon: "bedtime" },
      { label: "Cleanliness", value: "Moderately Tidy", match: "Okay", icon: "cleaning_services" },
      { label: "Social Level", value: "Social", match: "Okay", icon: "groups" },
      { label: "Guests", value: "Weekends mostly", match: "Match", icon: "door_open" }
    ],
    apartmentPhotos: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC0gFVSnr3f5dzIf__CSvW-kRCXF6WXuh1tcG5ll5V_hXrXZ8NquByfXaQ0WvS9st4Hfzw9ygJW6mYSevZ-TduGAehFsBZfeGbmsQtz-VywleZ_fi_VeJWTlTzsm_eBq8rYUuzSRkHcM_vyyRPqZecLHTFhOIPeWbHr93isk8Io3S084R18I2DI0gS2dxmNmlgmjSU_r-r8J0KEcwvqkm1GaMF3TEv2j3qTgqWn0b2YJcF3Le49MKBt",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1oY4QBhzDECSjK98wFwQhXFWrxLDd5bBKpzCMjJtlxHtvUhAJ1Aa1p3dE90F5Zf2kNPq4GqMlsWGw_VBjCpQbS9jfLHmPqruFc2AByRgpKtU2HawMKdGvuzEqcjz9U1yDfmnUv10z45WKcPowC-86CDU6KMxgNvfVG2mPlRYzkz_xr9pDLZ-hcVHekViMWK5DJWlNGqTzluYmbY-y05bzgF58TiEm970Tt4JW6KHesMxOhJS1JgBU"
    ],
    hasRoom: false,
    verified: true
  },
  {
    id: "sarah",
    name: "Sarah",
    age: 24,
    location: "Mission District",
    rent: 1400,
    compatibility: 95,
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmbaCGXsVTxhi6EJ3d-zBilR8D5zp44kwqAEarhLyO1YuqAauUEaMi-FS7rbK4VEPNMFZQLyCveNIfuIptLDzyPfovOFau7BnJbevxJsqcY_9jVJypeZB3NQV8PYyEzYfZLVabIV2_etksCWOk9QopxAqp9qewS1NqokwLIJcwpRmlqUB6Sc4BnRwnGudqAQ9t7IGySIfFD085K_Ut5g0OVl6y8VP6QAN0TxmJ5QX33OdHyd55hVh-",
    bio: "Looking for a clean, friendly environment. I work in tech, love trying out new pastry recipes on weekends, and practice yoga in the mornings. Respectful of personal boundaries but always up for a quick chat over tea!",
    interests: ["Baking", "Yoga", "Tech", "Tea", "Reading"],
    lifestyle: [
      { label: "Sleep Schedule", value: "Early Bird", match: "Match", icon: "bedtime" },
      { label: "Cleanliness", value: "Spotless", match: "Match", icon: "cleaning_services" },
      { label: "Social Level", value: "Moderately Social", match: "Match", icon: "groups" },
      { label: "Guests", value: "Occasionally", match: "Okay", icon: "door_open" }
    ],
    apartmentPhotos: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC0gFVSnr3f5dzIf__CSvW-kRCXF6WXuh1tcG5ll5V_hXrXZ8NquByfXaQ0WvS9st4Hfzw9ygJW6mYSevZ-TduGAehFsBZfeGbmsQtz-VywleZ_fi_VeJWTlTzsm_eBq8rYUuzSRkHcM_vyyRPqZecLHTFhOIPeWbHr93isk8Io3S084R18I2DI0gS2dxmNmlgmjSU_r-r8J0KEcwvqkm1GaMF3TEv2j3qTgqWn0b2YJcF3Le49MKBt",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9B-0BwFOpFHqdoiGNuJfU4fFrWWgp6Uisi3y7bWniXvsyXjMAazsJJFkLwXCZ0c4JVjaYzPrZP0E7V9xPrHZfT_q-ioh8H4a4kivFoijdmJstRf8YAzBiIqtq2W23pSIc8zoGtqGviRIlucpCX8KC0Q45BhGE4dxy4YNRDoRB1C1xosBiw6cbIAAqXxI79maP9HQiP5hCrTfjW-jQHakTex2zmeB5K5w63r9Kp5FNvzldW0aGQb-0"
    ],
    hasRoom: true,
    verified: true
  },
  {
    id: "jessica",
    name: "Jessica M.",
    age: 25,
    location: "Downtown",
    rent: 1250,
    compatibility: 94,
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwOKVIiy7gTJRggR4PflQy6UCHadXPQj28P2gPK5XI6FTM90t6KOLLCxJNOIIpfgZrjEOsuv3lZkXE5M0lF6qYnPp-5GIMkM-eiVdsDcsNJTRpr53DEf7_K4enNEekE3zEOQftxMEuE9wDtkxwKhAv_LI29A-LEIZwMxFXhgfp2WLDDWAbdgsE_gt7_TQTkv-nFDif7LmP6eFyUyRSQIlrvblsqyWtYv5wQZuxC_IUeGCnPVJBbHpB",
    bio: "I love checking out coffee shops and local art exhibits. I work as a content creator. Very respectful of quiet hours and always keep shared spaces tidy. Looking for a similarly creative roommate!",
    interests: ["Coffee", "Art", "Content Creation", "Cooking", "Photography"],
    lifestyle: [
      { label: "Sleep Schedule", value: "Flexible", match: "Match", icon: "bedtime" },
      { label: "Cleanliness", value: "Tidy", match: "Match", icon: "cleaning_services" },
      { label: "Social Level", value: "Social", match: "Match", icon: "groups" },
      { label: "Guests", value: "Rarely", match: "Okay", icon: "door_open" }
    ],
    apartmentPhotos: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC0gFVSnr3f5dzIf__CSvW-kRCXF6WXuh1tcG5ll5V_hXrXZ8NquByfXaQ0WvS9st4Hfzw9ygJW6mYSevZ-TduGAehFsBZfeGbmsQtz-VywleZ_fi_VeJWTlTzsm_eBq8rYUuzSRkHcM_vyyRPqZecLHTFhOIPeWbHr93isk8Io3S084R18I2DI0gS2dxmNmlgmjSU_r-r8J0KEcwvqkm1GaMF3TEv2j3qTgqWn0b2YJcF3Le49MKBt",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9B-0BwFOpFHqdoiGNuJfU4fFrWWgp6Uisi3y7bWniXvsyXjMAazsJJFkLwXCZ0c4JVjaYzPrZP0E7V9xPrHZfT_q-ioh8H4a4kivFoijdmJstRf8YAzBiIqtq2W23pSIc8zoGtqGviRIlucpCX8KC0Q45BhGE4dxy4YNRDoRB1C1xosBiw6cbIAAqXxI79maP9HQiP5hCrTfjW-jQHakTex2zmeB5K5w63r9Kp5FNvzldW0aGQb-0"
    ],
    hasRoom: true,
    verified: true
  },
  {
    id: "michael",
    name: "Michael Chen",
    age: 27,
    location: "Marina District",
    rent: 1500,
    compatibility: 88,
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYmk1tNDBrPzf708ZTRwjKLUb20qgAeTIoqiU517NySIyrUYhEGL24pJAFvRBRrmfqV2RpMRJ_rs8SIQ9csDJOhEcGXeVWdn_LL2FeF0ov2Rgw-hG8FSKSOCtJb0YoFG5NXBVq5vbflG-O0AaExEraFqmxty5kleM3E4o6FNyRTh9S90RP0q0C6e3Fkk-FFuZYqJ55K_OWbhpG-QFUgFIwQigdO-ZPT5ZkNoKb-YBGwVKPUomp31CQ",
    bio: "Software engineer who enjoys tennis, playing guitar, and board game nights. Pretty low-key during weekdays. Let's chat and see if we'd be a good fit!",
    interests: ["Tennis", "Guitar", "Board Games", "Tech", "Running"],
    lifestyle: [
      { label: "Sleep Schedule", value: "Night Owl", match: "Okay", icon: "bedtime" },
      { label: "Cleanliness", value: "Moderately Tidy", match: "Match", icon: "cleaning_services" },
      { label: "Social Level", value: "Friendly, values quiet", match: "Match", icon: "groups" },
      { label: "Guests", value: "Occasionally", match: "Match", icon: "door_open" }
    ],
    apartmentPhotos: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC0gFVSnr3f5dzIf__CSvW-kRCXF6WXuh1tcG5ll5V_hXrXZ8NquByfXaQ0WvS9st4Hfzw9ygJW6mYSevZ-TduGAehFsBZfeGbmsQtz-VywleZ_fi_VeJWTlTzsm_eBq8rYUuzSRkHcM_vyyRPqZecLHTFhOIPeWbHr93isk8Io3S084R18I2DI0gS2dxmNmlgmjSU_r-r8J0KEcwvqkm1GaMF3TEv2j3qTgqWn0b2YJcF3Le49MKBt"
    ],
    hasRoom: false,
    verified: false
  },
  {
    id: "emily",
    name: "Emily R.",
    age: 23,
    location: "Richmond",
    rent: 1100,
    compatibility: 75,
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuASk8E2OAG2LcUA3JsUw2SIGfYRFBOzbEGPULBBNgvO40IsHXtk98ISk7DM4LW4dhyvn_9YGHm5VOY4UxeEuEHFVcVNctV5oGS9tRvkyLyY1Mn3Wdd_ocLmgiYfbU8G6C_MReMflQJaELDnVfqSFPOCJJYX9k8Yo9tA9jWb_Xu9dHnlzn04CvX-q_2nwN45Z9Juuqu4oL9ntBMMh--r8UyCnVTzNsEy-Xeh99GZtNJVwiCC2x8WunG0",
    bio: "I work at a veterinary clinic and have a golden retriever who is super sweet. I love being outdoors, running, and cooking delicious plant-based meals.",
    interests: ["Pets", "Outdoors", "Running", "Cooking", "Sustainability"],
    lifestyle: [
      { label: "Sleep Schedule", value: "Early Bird", match: "Match", icon: "bedtime" },
      { label: "Cleanliness", value: "Tidy", match: "Okay", icon: "cleaning_services" },
      { label: "Social Level", value: "Moderately Social", match: "Match", icon: "groups" },
      { label: "Guests", value: "Occasionally", match: "Match", icon: "door_open" }
    ],
    apartmentPhotos: [],
    hasRoom: true,
    verified: false
  }
];

export const discoveryProfile = userProfiles[0];

