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

export const discoveryProfile = {
  name: "Alex",
  age: 26,
  compatibility: 92,
  photo:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCk3xTvo2D-1uKZCd4tK_cBQJAUTdPt_e6BBO4x7_JcIKQHE1P4DKEvOmp57jmp-XxPYsd_Tq0OO3BF6pFoYCK2uE8nL_v9XlpqE2ZOJqXIED2TAHZIR5ti6Izbw2jNsiumgpritPEjcgj_MCdhGz9DUtOLGWoSuBJwpGBHbCZLCxuCUhpe6208Or0I0HqKz9nel7nF-OOhkLkrEOXQIdHK39HNzDtGFeF9OhXbatztAtYGagS0FcHh",
};
