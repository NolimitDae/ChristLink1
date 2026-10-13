// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════
const SUPABASE_URL  = 'https://iqosvigdelnmarecpkkp.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxb3N2aWdkZWxubWFyZWNwa2twIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MzQ5NTcsImV4cCI6MjA4NzIxMDk1N30.eqyIsbnkxFBdKjHoHKs56dz1-4yDBXv8_-Rt9uq9zlE';
const STRIPE_PK     = 'pk_live_51Stha81sOqETIDGD9a01hbSMl0gLoYCvFvyhOhFJTA7W4pOFizj6csfIZzWv5Uyr00x4nBaHbHh0cWmomMsgZSlH00tAt9sbhf';
const API_BASE      = '';

// ═══════════════════════════════════════════════════════════
// BRAND SVG ASSETS
// ═══════════════════════════════════════════════════════════
const LOGO_MARK = `<img src="/icon-logo.png" alt="ChristLink" style="width:100%;height:100%;object-fit:cover;display:block">`;

const LOGO_FULL = `<div style="text-align:center">
  <img src="/Footer.png" alt="ChristLink" style="width:100%;max-width:280px;display:block;margin:0 auto">
</div>`;

const ICONS = {
  openToConnect:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 20 C5 14 9 10 14 10 C17 10 19 11.5 20.5 13.5" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><circle cx="14" cy="7" r="3" stroke="#C9A84C" stroke-width="2"/><path d="M18 20 C18 17 20 15 23 15 C26 15 28 17 28 20 L28 22 L18 22 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><circle cx="23" cy="11" r="2.5" stroke="#C9A84C" stroke-width="2"/><path d="M9 20 L9 24 L19 24" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  prayerPartners:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 22 L7 12 C6.5 10 7.5 8 9 8 C10 8 11 8.5 11.5 9.5 L14 16" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 22 L25 12 C25.5 10 24.5 8 23 8 C22 8 21 8.5 20.5 9.5 L18 16" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 22 C10 25 12.5 27 16 27 C19.5 27 22 25 22 22 L22 16 C22 14.5 21 13.5 19.5 13.5 L18 16 L16 18 L14 16 L12.5 13.5 C11 13.5 10 14.5 10 16 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/></svg>`,
  bibleStudy:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6 C6 6 10 5 16 7 C22 5 26 6 26 6 L26 26 C26 26 22 25 16 27 C10 25 6 26 6 26 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><path d="M16 7 L16 27" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M11 12 L14 12" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><path d="M11 15 L14 15" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="21" y1="9" x2="21" y2="15" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="19" y1="11" x2="23" y2="11" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  meetupAtEvents:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="9" r="3" stroke="#C9A84C" stroke-width="2"/><circle cx="21" cy="9" r="3" stroke="#C9A84C" stroke-width="2"/><path d="M5 24 C5 19 7.5 15 11 15" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M27 24 C27 19 24.5 15 21 15" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M13 24 C13 20 14.5 17 16 17 C17.5 17 19 20 19 24" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="13" r="3" stroke="#C9A84C" stroke-width="2"/><path d="M14 27 C14.5 25.5 15.2 25 16 25 C16.8 25 17.5 25.5 18 27" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  worshipTeam:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="4" width="8" height="14" rx="4" stroke="#C9A84C" stroke-width="2"/><path d="M8 16 C8 22 24 22 24 16" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="22" x2="16" y2="28" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="11" y1="28" x2="21" y2="28" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  volunteering:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 14 L6 12 C6 10 8 9 10 10 L14 12 L18 10 C20 9 22 10 22 12 L22 14" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M4 14 L28 14 L26 22 L6 22 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><line x1="16" y1="16" x2="16" y2="20" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="14" y1="18" x2="18" y2="18" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M10 22 L10 26 M22 22 L22 26" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  justChatting:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 6 C5 5 6 4 7 4 L22 4 C23 4 24 5 24 6 L24 16 C24 17 23 18 22 18 L14 18 L9 23 L9 18 L7 18 C6 18 5 17 5 16 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><path d="M14 20 C14 19 15 18.5 16 18.5 L25 18.5 C26 18.5 27 19.5 27 20.5 L27 26 L24 24 L16 24 C15 24 14 23 14 22 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><circle cx="11" cy="11" r="1" fill="#C9A84C"/><circle cx="15" cy="11" r="1" fill="#C9A84C"/><circle cx="19" cy="11" r="1" fill="#C9A84C"/></svg>`,
  dailyVerse:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 5 C7 5 11 4 16 6 C21 4 25 5 25 5 L25 24 C25 24 21 23 16 25 C11 23 7 24 7 24 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><path d="M16 6 L16 25" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="1" x2="16" y2="3.5" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="20" y1="2" x2="19" y2="4" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="2" x2="13" y2="4" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="23" y1="4" x2="21.5" y2="5.5" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="9" y1="4" x2="10.5" y2="5.5" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="20" y1="9" x2="20" y2="14" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="18" y1="11" x2="22" y2="11" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  events:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="7" width="24" height="22" rx="3" stroke="#C9A84C" stroke-width="2"/><path d="M4 13 L28 13" stroke="#C9A84C" stroke-width="2"/><line x1="10" y1="4" x2="10" y2="10" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="22" y1="4" x2="22" y2="10" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="17" x2="16" y2="22" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="13.5" y1="19.5" x2="18.5" y2="19.5" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><rect x="7" y="17" width="3" height="3" rx="0.5" stroke="#C9A84C" stroke-width="1.5"/><rect x="22" y="17" width="3" height="3" rx="0.5" stroke="#C9A84C" stroke-width="1.5"/><rect x="7" y="23" width="3" height="3" rx="0.5" stroke="#C9A84C" stroke-width="1.5"/><rect x="22" y="23" width="3" height="3" rx="0.5" stroke="#C9A84C" stroke-width="1.5"/></svg>`,
  giveSupport:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 27 C16 27 5 20 5 13 C5 9.5 7.5 7 11 7 C13 7 14.8 8 16 9.5 C17.2 8 19 7 21 7 C24.5 7 27 9.5 27 13 C27 20 16 27 16 27Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><path d="M10 23 L7 26 C6 27 7 29 8.5 28 L20 22" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M20 18 L23 16 C24.5 15 26 16.5 25 18 L20 22 L10 23" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  community:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="8" r="3.5" stroke="#C9A84C" stroke-width="2"/><circle cx="7" cy="13" r="3" stroke="#C9A84C" stroke-width="2"/><circle cx="25" cy="13" r="3" stroke="#C9A84C" stroke-width="2"/><path d="M10 27 C10 22 12.5 19 16 19 C19.5 19 22 22 22 27" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M4 27 C4 23 5.5 20.5 7 19.5" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M28 27 C28 23 26.5 20.5 25 19.5" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M14 5 C14 3.5 15 3 16 3.5 C17 3 18 3.5 18 5 C18 7 16 8.5 16 8.5 C16 8.5 14 7 14 5Z" stroke="#C9A84C" stroke-width="1.5" fill="none"/></svg>`,
  fellowship:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="7" r="3" stroke="#C9A84C" stroke-width="2"/><circle cx="7" cy="18" r="3" stroke="#C9A84C" stroke-width="2"/><circle cx="25" cy="18" r="3" stroke="#C9A84C" stroke-width="2"/><path d="M16 10 L16 14" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M9.5 20 L13.5 15.5" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><path d="M22.5 20 L18.5 15.5" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><path d="M4 27 C4 23 5.5 21 7 21" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M28 27 C28 23 26.5 21 25 21" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M11 27 C11 23.5 13 22 16 22 C19 22 21 23.5 21 27" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  newFriends:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="9" r="4" stroke="#C9A84C" stroke-width="2"/><path d="M4 27 C4 21.5 7 18 11 18" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M16 27 C16 22.5 18 19.5 22 19.5 C26 19.5 28 22.5 28 27" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><circle cx="22" cy="14" r="3.5" stroke="#C9A84C" stroke-width="2"/><line x1="22" y1="8" x2="22" y2="5" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="19.5" y1="6.5" x2="24.5" y2="6.5" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  myProfile:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="11" r="5" stroke="#C9A84C" stroke-width="2"/><path d="M7 27 C7 21.5 11 17 16 17 C21 17 25 21.5 25 27" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="24" r="5" fill="#0a0a14" stroke="#C9A84C" stroke-width="1.5"/><path d="M24 20 C22 20 20.5 21.5 20.5 23 C20.5 25 24 28 24 28 C24 28 27.5 25 27.5 23 C27.5 21.5 26 20 24 20Z" stroke="#C9A84C" stroke-width="1.5" fill="none"/><circle cx="24" cy="23" r="1" fill="#C9A84C"/></svg>`,
  notifications:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4 C11 4 8 8 8 13 L8 20 L5 23 L27 23 L24 20 L24 13 C24 8 21 4 16 4Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><path d="M13 23 C13 24.7 14.3 26 16 26 C17.7 26 19 24.7 19 23" stroke="#C9A84C" stroke-width="2"/><circle cx="23" cy="7" r="4" fill="#C9A84C"/></svg>`,
  bible:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 5 C6 5 10 4 16 6 C22 4 26 5 26 5 L26 25 C26 25 22 24 16 26 C10 24 6 25 6 25 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><path d="M16 6 L16 26" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><circle cx="22" cy="22" r="4" fill="#0a0a14" stroke="#C9A84C" stroke-width="2"/><line x1="25" y1="25" x2="28" y2="28" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="21" y1="20.5" x2="21" y2="23.5" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="19.5" y1="22" x2="22.5" y2="22" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  discover:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="11" stroke="#C9A84C" stroke-width="2"/><circle cx="16" cy="16" r="2" fill="#C9A84C"/><path d="M16 7 L17.5 14.5 L16 16 L14.5 14.5 Z" fill="#C9A84C" opacity="0.9"/><path d="M16 25 L17.5 17.5 L16 16 L14.5 17.5 Z" stroke="#C9A84C" stroke-width="1" fill="none"/><line x1="16" y1="5" x2="16" y2="7.5" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="24.5" x2="16" y2="27" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="5" y1="16" x2="7.5" y2="16" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="24.5" y1="16" x2="27" y2="16" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  morningDevotion:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 22 Q16 14 27 22" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M5 26 L27 26" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M5 29 L27 29" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" opacity="0.5"/><line x1="16" y1="13" x2="16" y2="22" stroke="#C9A84C" stroke-width="2.5" stroke-linecap="round"/><line x1="12" y1="16.5" x2="20" y2="16.5" stroke="#C9A84C" stroke-width="2.5" stroke-linecap="round"/><line x1="16" y1="6" x2="16" y2="9" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="22" y1="8" x2="20.5" y2="10" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="10" y1="8" x2="11.5" y2="10" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="25" y1="13" x2="22.5" y2="14" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="7" y1="13" x2="9.5" y2="14" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  prayerRequests:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 28 C10 28 7 24 7 19 C7 14 11 11 13 8 C13 12 15 13 15 13 C15 13 14 10 17 7 C17 12 20 14 21 17 C22 14 21 12 20 10 C23 13 25 16 25 19 C25 24 22 28 16 28Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round" fill="none"/><path d="M16 25 C13 25 12 23 12 21 C12 18.5 14 17 15 16 C15 18 16.5 19 16.5 19 C16.5 19 17 17.5 18.5 16.5 C19 18 20 19.5 20 21 C20 23 19 25 16 25Z" stroke="#C9A84C" stroke-width="1.5" fill="none"/></svg>`,
  goals:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="11" stroke="#C9A84C" stroke-width="2"/><circle cx="16" cy="16" r="6.5" stroke="#C9A84C" stroke-width="1.5"/><line x1="16" y1="11" x2="16" y2="21" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="11" y1="16" x2="21" y2="16" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="22" y1="5" x2="17.5" y2="14" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M22 5 L25 9 M22 5 L18 4" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  encouragement:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4 L27 8 L27 17 C27 22 22 27 16 29 C10 27 5 22 5 17 L5 8 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><path d="M16 20 C13 20 11 18 11 16 C11 14 13 13 15 14 C14 12 15 11 17 11 C19 11 21 13 20 15 L23 13 C23 13 22 17 20 18 L22 20 Z" stroke="#C9A84C" stroke-width="1.5" stroke-linejoin="round" fill="none"/><circle cx="17.5" cy="11.5" r="1" fill="#C9A84C"/></svg>`,
  inspiration:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 3 L17.5 14 L28 16 L17.5 18 L16 29 L14.5 18 L4 16 L14.5 14 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round" fill="none"/><path d="M25 6 L25.6 8 L27.5 8.5 L25.6 9 L25 11 L24.4 9 L22.5 8.5 L24.4 8 Z" stroke="#C9A84C" stroke-width="1.2" fill="none"/><path d="M7 23 L7.4 24.5 L9 24.8 L7.4 25.2 L7 27 L6.6 25.2 L5 24.8 L6.6 24.5 Z" stroke="#C9A84C" stroke-width="1.2" fill="none"/></svg>`,
  cross:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="4" width="4" height="24" rx="1.5" fill="#C9A84C"/><rect x="6" y="11" width="20" height="4" rx="1.5" fill="#C9A84C"/></svg>`,
  ticket:`<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" stroke="#C9A84C" stroke-width="2.5" fill="rgba(201,168,76,.08)"/><path d="M18 32 L27 42 L46 22" stroke="#C9A84C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  rocket:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 5 C16 5 23 8 23 17 L23 21 L20 24 L12 24 L9 21 L9 17 C9 8 16 5 16 5Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><path d="M9 17 L6 20 L7 23 L12 24" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 17 L26 20 L25 23 L20 24" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="14" r="2.5" stroke="#C9A84C" stroke-width="1.5"/><path d="M13 27 C13 27 14 25 16 25 C18 25 19 27 19 27" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  clipboard:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="7" width="18" height="22" rx="2" stroke="#C9A84C" stroke-width="2"/><path d="M12 7 L12 5 C12 4 13 3 14 3 L18 3 C19 3 20 4 20 5 L20 7" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="11" y1="14" x2="21" y2="14" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="11" y1="18" x2="21" y2="18" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="11" y1="22" x2="17" y2="22" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  mail:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="8" width="24" height="17" rx="2" stroke="#C9A84C" stroke-width="2"/><path d="M4 10 L16 18 L28 10" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  camera:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 11 L4 24 C4 25 5 26 6 26 L26 26 C27 26 28 25 28 24 L28 11 C28 10 27 9 26 9 L22 9 L20 6 L12 6 L10 9 L6 9 C5 9 4 10 4 11Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><circle cx="16" cy="18" r="5" stroke="#C9A84C" stroke-width="2"/><circle cx="24" cy="12" r="1.5" fill="#C9A84C"/></svg>`,
  save:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4 L24 4 L28 8 L28 26 C28 27 27 28 26 28 L6 28 C5 28 4 27 4 26 L4 6 C4 5 5 4 6 4Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><path d="M11 4 L11 12 L21 12 L21 4" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><rect x="9" y="18" width="14" height="10" rx="1" stroke="#C9A84C" stroke-width="2"/><line x1="18" y1="7" x2="18" y2="10" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  link:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 19 C13 19 10 22 8 22 C5.8 22 4 20.2 4 18 C4 15.8 5.8 14 8 14 L12 14" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M19 13 C19 13 22 10 24 10 C26.2 10 28 11.8 28 14 C28 16.2 26.2 18 24 18 L20 18" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="11" y1="21" x2="21" y2="11" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  pin:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4 C11.6 4 8 7.6 8 12 C8 18 16 28 16 28 C16 28 24 18 24 12 C24 7.6 20.4 4 16 4Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><circle cx="16" cy="12" r="3" stroke="#C9A84C" stroke-width="2"/></svg>`,
  person:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="10" r="5" stroke="#C9A84C" stroke-width="2"/><path d="M6 28 C6 22 10.5 17 16 17 C21.5 17 26 22 26 28" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  card:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="8" width="26" height="17" rx="3" stroke="#C9A84C" stroke-width="2"/><line x1="3" y1="14" x2="29" y2="14" stroke="#C9A84C" stroke-width="2"/><rect x="7" y="19" width="6" height="3" rx="1" stroke="#C9A84C" stroke-width="1.5"/><line x1="18" y1="20.5" x2="25" y2="20.5" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  money:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="9" width="26" height="15" rx="2" stroke="#C9A84C" stroke-width="2"/><circle cx="16" cy="16.5" r="3.5" stroke="#C9A84C" stroke-width="1.5"/><line x1="16" y1="13" x2="16" y2="12" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="16" y1="20" x2="16" y2="21" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  xCircle:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="12" stroke="#C9A84C" stroke-width="2"/><path d="M11 11 L21 21 M21 11 L11 21" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  share:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6 L26 12 L20 18" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 12 L12 12 C8.7 12 6 14.7 6 18 L6 26" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  phone:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="3" width="14" height="26" rx="3" stroke="#C9A84C" stroke-width="2"/><circle cx="16" cy="26" r="1.5" fill="#C9A84C"/><line x1="13" y1="7" x2="19" y2="7" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  people:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="10" r="4" stroke="#C9A84C" stroke-width="2"/><circle cx="22" cy="12" r="3" stroke="#C9A84C" stroke-width="2"/><path d="M4 28 C4 22 7.5 18 12 18 C16.5 18 20 22 20 28" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M20 19 C21 18.2 22.5 17.5 24 17.5 C27 17.5 29 20 29 23" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  music:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22 L12 8 L27 5 L27 19" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="23" r="3" stroke="#C9A84C" stroke-width="2"/><circle cx="24" cy="20" r="3" stroke="#C9A84C" stroke-width="2"/></svg>`,
  settings:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="4" stroke="#C9A84C" stroke-width="2"/><path d="M14.5 4L13 8C12.3 8.2 11.6 8.5 11 9L7 7.5L5 10.8L8 13.5C7.9 14 7.9 14.7 8 15.2L5 18L7 21.3L11 19.8C11.6 20.3 12.3 20.6 13 20.8L14.5 25H17.5L19 20.8C19.7 20.6 20.4 20.3 21 19.8L25 21.3L27 18L24 15.2C24.1 14.7 24.1 14 24 13.5L27 10.8L25 7.5L21 9C20.4 8.5 19.7 8.2 19 8L17.5 4Z" stroke="#C9A84C" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  smile:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="12" stroke="#C9A84C" stroke-width="2"/><circle cx="11.5" cy="13.5" r="1.5" fill="#C9A84C"/><circle cx="20.5" cy="13.5" r="1.5" fill="#C9A84C"/><path d="M10.5 19 C11.5 22 14 23.5 16 23.5 C18 23.5 20.5 22 21.5 19" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  pencil:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 5 L27 9 L10 26 L5 27 L6 22 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><path d="M20 8 L24 12" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  image:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="6" width="24" height="20" rx="2" stroke="#C9A84C" stroke-width="2"/><circle cx="11" cy="12" r="2.5" stroke="#C9A84C" stroke-width="1.5"/><path d="M4 22 L10 16 L15 21 L20 15 L28 22" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/></svg>`,
  celebrate:`<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" stroke="#C9A84C" stroke-width="2.5" fill="rgba(201,168,76,.08)"/><path d="M18 32 L27 42 L46 22" stroke="#C9A84C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  instagram:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="24" height="24" rx="7" stroke="#E1306C" stroke-width="2"/><circle cx="16" cy="16" r="5" stroke="#E1306C" stroke-width="2"/><circle cx="23" cy="9" r="1.5" fill="#E1306C"/></svg>`,
  facebook:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="13" stroke="#1877F2" stroke-width="2"/><path d="M20 5.5 L18 5.5 C15.8 5.5 14 7.3 14 9.5 L14 13 L11 13 L11 17 L14 17 L14 27 L18 27 L18 17 L21 17 L22 13 L18 13 L18 9.5 C18 9.2 18.2 9 18.5 9 L20 9 Z" stroke="#1877F2" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  tiktok:`<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 4 C21 4 21.5 9 27 10 L27 14 C27 14 24 14 21 12 L21 20 C21 24 18.5 27 15 27 C11.5 27 9 24.5 9 21 C9 17.5 11.5 15 15 15 C15.7 15 16.3 15.1 17 15.3 L17 19.5 C16.4 19.2 15.7 19 15 19 C13.3 19 12 20.3 12 22 C12 23.7 13.3 25 15 25 C16.7 25 18 23.7 18 22 L18 4 Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
};

function icon(name, size = 22) {
  const svg = ICONS[name];
  if (!svg) return '';
  return svg.replace('<svg ', `<svg width="${size}" height="${size}" `);
}

const GLYPHS = {
  check: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  x:     `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  warn:  `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L13 12H1L7 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="7" y1="6" x2="7" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="10.5" r="0.7" fill="currentColor"/></svg>`,
};
function glyph(name, color) {
  const g = GLYPHS[name] || '';
  return color ? g.replace(/currentColor/g, color) : g;
}

// ═══════════════════════════════════════════════════════════
// CLIENTS
// ═══════════════════════════════════════════════════════════
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
const stripeClient = Stripe(STRIPE_PK);
const stripeElements = stripeClient.elements({
  appearance:{
    theme:'night',
    variables:{
      colorPrimary:'#C9A84C',colorBackground:'#1E1E2A',colorText:'#F0EBE0',
      colorDanger:'#E05050',fontFamily:'DM Sans, system-ui, sans-serif',
      borderRadius:'10px',spacingUnit:'4px'
    }
  }
});

// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════
let currentUser    = null;
let currentSession = null;
let profileData    = {};
let selectedEvent  = null;
let currentQty     = 1;
let listingFeePaid = false;
let listingFeePaymentMethodId = null;
let publishMode = 'publish'; // 'draft' | 'scheduled' | 'publish'
let listingFeeHostEmail = null;
let listingFeePromoCode = null;
let authMode       = 'signin';
let pendingAction  = null;
let _pendingProfileUserId = null; // set when a #user/UUID link is opened before auth
let isNewSignup    = false;
let cardEl         = null;
let lfCardNum = null, lfCardExp = null, lfCardCvc = null;
let resendTimer    = null;
let ticketRowCount = 0;
let coverPhotoFile  = null;   // File object for cover photo
let coverPhotoB64   = null;   // base64 preview
let galleryFiles    = [];     // Array of File objects
let nearMeActive   = false;
let userLocation   = null;
let activeFilters  = { type:[], price:[], format:[] };
let obAvatarColor  = null, obAvatarUrl = null;
let epAvatarColor  = null, epAvatarUrl = null, epRingColor = null;

const BIBLE_VERSIONS = [
  { code: 'KJV',  name: 'King James Version (KJV)' },
  { code: 'NKJV', name: 'New King James Version (NKJV)' },
  { code: 'NIV',  name: 'New International Version (NIV)' },
  { code: 'ESV',  name: 'English Standard Version (ESV)' },
  { code: 'NLT',  name: 'New Living Translation (NLT)' },
  { code: 'AMP',  name: 'Amplified Bible (AMP)' },
  { code: 'CSB',  name: 'Christian Standard Bible (CSB)' },
  { code: 'NASB', name: 'New American Standard Bible (NASB)' },
  { code: 'MSG',  name: 'The Message (MSG)' },
  { code: 'NET',  name: 'New English Translation (NET)' },
  { code: 'GNT',  name: 'Good News Translation (GNT)' },
  { code: 'TLB',  name: 'The Living Bible (TLB)' },
];
const CONNECT_TAGS = [
  { id: 'prayer',     iconName: 'prayerPartners', label: 'Prayer Partner' },
  { id: 'bible',      iconName: 'bibleStudy',     label: 'Bible Study Buddy' },
  { id: 'meetup',     iconName: 'meetupAtEvents',  label: 'Meet Up at Events' },
  { id: 'worship',    iconName: 'worshipTeam',     label: 'Worship Team' },
  { id: 'volunteer',  iconName: 'volunteering',    label: 'Volunteering' },
  { id: 'chat',       iconName: 'justChatting',    label: 'Just Chatting' },
  { id: 'mentorship',   iconName: 'community',       label: 'Mentorship' },
  { id: 'family',       iconName: 'giveSupport',     label: 'Family & Parenting' },
  { id: 'fellowship',   iconName: 'fellowship',      label: 'Fellowship' },
  { id: 'new-friends',  iconName: 'newFriends',      label: 'New Friends' },
];

const AVATAR_COLORS = [
  'linear-gradient(135deg,#C9A84C,#6B4A00)',
  'linear-gradient(135deg,#3B6FE8,#1E3A8A)',
  'linear-gradient(135deg,#7C3AED,#4C1D95)',
  'linear-gradient(135deg,#059669,#064E3B)',
  'linear-gradient(135deg,#DC2626,#7F1D1D)',
  'linear-gradient(135deg,#D97706,#78350F)',
  'linear-gradient(135deg,#0891B2,#164E63)',
  'linear-gradient(135deg,#BE185D,#500724)',
];

const EVENT_TYPES = ['Worship','Bible Study','Retreat','Youth','Prayer','Fellowship','Conference','Concert','Outreach'];

const VERSES_POOL = [
  {t:'"I can do all things through Christ who strengthens me."',r:'— Philippians 4:13'},
  {t:'"For God so loved the world that he gave his one and only Son."',r:'— John 3:16'},
  {t:'"The Lord is my shepherd, I lack nothing."',r:'— Psalm 23:1'},
  {t:'"Trust in the Lord with all your heart."',r:'— Proverbs 3:5'},
  {t:'"Be still, and know that I am God."',r:'— Psalm 46:10'},
  {t:'"The Lord your God is with you, the Mighty Warrior who saves."',r:'— Zephaniah 3:17'},
  {t:'"I am the way and the truth and the life."',r:'— John 14:6'},
  {t:'"Fear not, for I am with you; be not dismayed, for I am your God."',r:'— Isaiah 41:10'},
  {t:'"Cast all your anxiety on him because he cares for you."',r:'— 1 Peter 5:7'},
  {t:'"But seek first his kingdom and his righteousness."',r:'— Matthew 6:33'},
  {t:'"Your word is a lamp for my feet, a light on my path."',r:'— Psalm 119:105'},
  {t:'"The name of the Lord is a fortified tower; the righteous run to it and are safe."',r:'— Proverbs 18:10'},
  {t:'"For I know the plans I have for you, plans to prosper you and not to harm you."',r:'— Jeremiah 29:11'},
  {t:'"Come to me, all you who are weary and burdened, and I will give you rest."',r:'— Matthew 11:28'},
  {t:'"With God all things are possible."',r:'— Matthew 19:26'},
  {t:'"The joy of the Lord is your strength."',r:'— Nehemiah 8:10'},
  {t:'"Love is patient, love is kind. It does not envy, it does not boast."',r:'— 1 Corinthians 13:4'},
  {t:'"Be strong and courageous. Do not be afraid; do not be discouraged."',r:'— Joshua 1:9'},
  {t:'"He heals the brokenhearted and binds up their wounds."',r:'— Psalm 147:3'},
  {t:'"And we know that in all things God works for the good of those who love him."',r:'— Romans 8:28'},
  {t:'"Delight yourself in the Lord, and he will give you the desires of your heart."',r:'— Psalm 37:4'},
  {t:'"Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God."',r:'— Philippians 4:6'},
  {t:'"Create in me a pure heart, O God, and renew a steadfast spirit within me."',r:'— Psalm 51:10'},
  {t:'"I am the resurrection and the life. The one who believes in me will live."',r:'— John 11:25'},
  {t:'"No weapon forged against you will prevail."',r:'— Isaiah 54:17'},
  {t:'"Greater is he that is in you, than he that is in the world."',r:'— 1 John 4:4'},
  {t:'"The Lord bless you and keep you; the Lord make his face shine on you."',r:'— Numbers 6:24–25'},
  {t:'"Walk by faith, not by sight."',r:'— 2 Corinthians 5:7'},
  {t:'"Let everything that has breath praise the Lord."',r:'— Psalm 150:6'},
  {t:'"Give thanks to the Lord, for he is good; his love endures forever."',r:'— Psalm 107:1'},
  {t:'"Those who hope in the Lord will renew their strength."',r:'— Isaiah 40:31'},
  {t:'"A friend loves at all times, and a brother is born for a time of adversity."',r:'— Proverbs 17:17'},
  {t:'"This is the day the Lord has made; we will rejoice and be glad in it."',r:'— Psalm 118:24'},
  {t:'"Let your light shine before others, that they may see your good deeds."',r:'— Matthew 5:16'},
  {t:'"My grace is sufficient for you, for my power is made perfect in weakness."',r:'— 2 Corinthians 12:9'},
];

// Pick today's 5 verses using day-of-year as offset so they change daily
const _today = new Date();
const _doy   = Math.floor((_today - new Date(_today.getFullYear(), 0, 0)) / 86400000);
const _start = (_doy * 5) % VERSES_POOL.length;
const VERSES  = Array.from({length: 5}, (_, i) => VERSES_POOL[(_start + i) % VERSES_POOL.length]);

// ═══════════════════════════════════════════════════════════
// SUPABASE AUTH
// ═══════════════════════════════════════════════════════════
let _notifPollTimer = null;
let _homeFeedTimer  = null;
let _lastVisibleAt  = Date.now();

function startNotifPoll() {
  if (_notifPollTimer) return;
  _notifPollTimer = setInterval(() => { if (currentUser) fetchNotifCount(); }, 30000);
}
function stopNotifPoll() {
  if (_notifPollTimer) { clearInterval(_notifPollTimer); _notifPollTimer = null; }
}
function startHomeFeedPoll() {
  if (_homeFeedTimer) return;
  _homeFeedTimer = setInterval(() => {
    if (document.querySelector('#page-home.active')) fetchHomeEvents();
  }, 60000);
}
function stopHomeFeedPoll() {
  if (_homeFeedTimer) { clearInterval(_homeFeedTimer); _homeFeedTimer = null; }
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') { _lastVisibleAt = Date.now(); return; }
  const elapsed = Date.now() - _lastVisibleAt;
  _lastVisibleAt = Date.now();
  if (elapsed < 30000) return; // less than 30s away — skip
  const active = document.querySelector('.page.active')?.id?.replace('page-', '');
  if (!active) return;
  if (active === 'home')      { fetchHomeEvents(); fetchDiscoveryRows(); }
  if (active === 'profile')   { fetchProfile(); }
  if (active === 'community') { initCommunityFeed(false); }
  if (active === 'browse')    { initBrowse(); }
  _adminLoaded = {};
});

sb.auth.onAuthStateChange((event, session) => {
  currentSession = session;
  currentUser    = session?.user || null;
  syncAuthUI();
  if (currentUser) { fetchProfile(); fetchNotifCount(); startNotifPoll(); startHomeFeedPoll(); }
  else { stopNotifPoll(); stopHomeFeedPoll(); }
  if (currentUser) {
    const lp = document.getElementById('page-landing');
    if (lp && lp.classList.contains('active')) {
      lp.classList.remove('active');
      lp.style.display = 'none';
      lp.style.overflow = '';
      lp.style.overscrollBehavior = '';
      lp.style.touchAction = '';
      lp.style.height = '';
      lp.style.minHeight = '';
      lp.style.paddingTop = '0';
      document.body.style.overflow = '';
      document.getElementById('landingNavSection').style.display = '';
      document.getElementById('landingCtaSection').style.display = '';
      document.getElementById('landingSignInBtn').style.display = '';
      document.getElementById('landingBackBtn').style.display = 'none';
      document.getElementById('tabbar').style.display = '';
      document.getElementById('topnav').style.display = '';
      goTo('home');
    }
  }
});

(async () => {
  const { data:{ session } } = await sb.auth.getSession();
  currentSession = session;
  currentUser    = session?.user || null;
  syncAuthUI();
  if (currentUser) {
    fetchProfile(); fetchNotifCount(); startNotifPoll(); startHomeFeedPoll();
    if (!document.querySelector('.page.active')) goTo('home');
    if (_pendingProfileUserId) {
      const uid = _pendingProfileUserId; _pendingProfileUserId = null;
      setTimeout(() => openPublicProfile(uid), 350);
    }
  } else {
    const hasDeepLink = window.location.search.includes('connect_return') ||
                        window.location.search.includes('listing_success') ||
                        window.location.search.includes('reauth');
    if (!hasDeepLink) {
      document.getElementById('page-home').classList.remove('active');
      const lp = document.getElementById('page-landing');
      lp.classList.add('active');
      lp.style.display = 'flex';
      lp.style.overflow = 'hidden';
      lp.style.overscrollBehavior = 'none';
      lp.style.touchAction = 'none';
      lp.style.height = '100vh';
      lp.style.minHeight = '0';
      lp.style.paddingTop = 'env(safe-area-inset-top, 0px)';
      document.getElementById('landingSignInBtn').style.display = '';
      document.getElementById('landingBackBtn').style.display = 'none';
      document.getElementById('landingCtaSection').style.display = '';
      document.body.style.overflow = 'hidden';
      _landingSwipeInit(lp);
      document.getElementById('tabbar').style.display = 'none';
      document.getElementById('topnav').style.display = 'none';
    }
  }
})();

function syncAuthUI() {
  const out = document.getElementById('nav-loggedout');
  const inn = document.getElementById('nav-loggedin');
  const hGate = document.getElementById('host-gate');
  const hForm  = document.getElementById('host-form');
  const pGate  = document.getElementById('prof-gate');
  const pCont  = document.getElementById('prof-content');
  const cGate  = document.getElementById('community-gate');
  const cForm  = document.getElementById('community-form');

  if (currentUser) {
    out.style.display  = 'none';
    inn.style.display  = 'block';
    hGate.style.display = 'none';
    hForm.style.display = 'block';
    pGate.style.display = 'none';
    pCont.style.display = 'block';
    cGate.style.display = 'none';
    cForm.style.display = 'block';
    // update avatar btn
    const n = profileData?.full_name || currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || '?';
    const avBtn = document.getElementById('navAvatarBtn');
    if (profileData?.avatar_url) {
      avBtn.innerHTML = `<img alt="" src="${profileData.avatar_url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
    } else {
      avBtn.textContent = n.charAt(0).toUpperCase();
      if (profileData?.avatar_color) avBtn.style.background = profileData.avatar_color;
    }
    // post avatar
    const cAv = document.getElementById('commAv');
    cAv.innerHTML = '';
    if (profileData?.avatar_url) {
      cAv.style.background = 'transparent';
      const cImg = document.createElement('img');
      cImg.src = profileData.avatar_url;
      cImg.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%';
      cAv.appendChild(cImg);
    } else {
      cAv.textContent = n.charAt(0).toUpperCase();
      cAv.style.background = profileData?.avatar_color || 'var(--surface3)';
      cAv.style.color = profileData?.avatar_color ? '#000' : 'var(--muted)';
    }
  } else {
    out.style.display  = 'flex';
    inn.style.display  = 'none';
    hGate.style.display = 'block';
    hForm.style.display = 'none';
    pGate.style.display = 'flex';
    pCont.style.display = 'none';
    cGate.style.display = 'block';
    cForm.style.display = 'none';
  }
}

async function signOut() {
  await sb.auth.signOut();
  profileData = {};
  currentUser = null;
  syncAuthUI();
  closeDrop();
  goTo('home');
  showToast('Signed out. See you soon!');
}

// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════════════
function applyTheme(theme) {
  const isLight = theme === 'light';
  document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
  document.querySelector('meta[name="theme-color"]').content = isLight ? '#F5F0E8' : '#0A0A0F';
  const btn = document.getElementById('dd-theme-toggle');
  if (btn) {
    btn.innerHTML = isLight
      ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:5px;color:var(--gold)"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>Dark Mode`
      : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:5px;color:var(--gold)"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>Light Mode`;
  }
}
function toggleTheme() {
  closeDrop();
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  localStorage.setItem('cl-theme', next);
  applyTheme(next);
}
document.querySelectorAll('.cl-year').forEach(el => el.textContent = new Date().getFullYear());
// Escape closes the top-most open sheet/modal and the profile menu
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const open = [...document.querySelectorAll('.sheet-overlay.open')].pop();
  if (open) { closeSheet(open.id); return; }
  const dd = document.getElementById('nav-dropdown');
  if (dd && dd.style.display !== 'none') closeDrop();
});
// Restore saved theme on load
applyTheme(localStorage.getItem('cl-theme') || 'dark');

// NAV DROPDOWN
// ═══════════════════════════════════════════════════════════
function toggleDrop() {
  const dd = document.getElementById('nav-dropdown');
  const isOpen = dd.style.display !== 'none';
  if (isOpen) { closeDrop(); return; }
  dd.style.display = 'block';
  document.getElementById('dd-name').textContent  = profileData?.full_name || currentUser?.email?.split('@')[0] || '—';
  document.getElementById('dd-email').textContent = currentUser?.email || '—';
  applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');
  setTimeout(() => document.addEventListener('click', outsideDrop, {once:true}), 50);
}
function closeDrop() {
  document.getElementById('nav-dropdown').style.display = 'none';
}
function outsideDrop(e) {
  const dd = document.getElementById('nav-dropdown');
  const btn = document.getElementById('navAvatarBtn');
  if (!dd.contains(e.target) && !btn.contains(e.target)) closeDrop();
}

// ═══════════════════════════════════════════════════════════
// PAGE ROUTING
// ═══════════════════════════════════════════════════════════
let prevPage = 'browse'; // track where the user came from for back buttons
function goTo(page) {
  if (page !== 'detail') document.title = 'Christ Link — Faith Events Near You';
  const curr = document.querySelector('.page.active');
  const next = document.getElementById('page-' + page);
  if (!next) return;
  // On desktop, re-running init for same page re-loads data (e.g. clicking active nav item)
  if (curr === next) {
    if (page === 'browse') { browseReady = false; initBrowse(); }
    if (page === 'community') initCommunityFeed(false);
    if (page === 'profile') { fetchProfile(); fetchMyEvents(); }
    return;
  }
  // Track previous page so back buttons can return correctly
  if (curr?.id) prevPage = curr.id.replace('page-', '');
  // Reset browseReady when leaving browse so re-navigation always fetches fresh events
  if (curr?.id === 'page-browse') browseReady = false;
  // Stop forum polling when leaving the forum page
  if (curr?.id === 'page-forum') { clearInterval(forumPolling); forumPolling = null; }
  if (curr) curr.classList.remove('active');
  // Slide-in for drill-down pages, fade-up for top-level
  const slidePages = ['event-detail', 'forum'];
  next.classList.remove('slide-in');
  void next.offsetWidth; // force reflow so animation restarts
  if (slidePages.includes(page)) next.classList.add('slide-in');
  next.classList.add('active');

  // update tab bar — hide on full-screen pages
  const noTab = ['event-detail','forum'];
  document.getElementById('tabbar').style.display = noTab.includes(page) ? 'none' : '';
  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  const tab = document.getElementById('tab-' + page);
  if (tab) tab.classList.add('active');

  // update desktop nav
  document.querySelectorAll('.nav-desktop-links a').forEach(a => a.classList.toggle('active', a.dataset.page === page));

  // persist current page in URL hash so refresh restores it
  let hashPage;
  if (page === 'home') hashPage = '';
  else if (page === 'event-detail' && selectedEvent?.id) hashPage = `event/${selectedEvent.id}`;
  else if (page === 'forum' && forumEventId) hashPage = `forum/${forumEventId}`;
  else hashPage = page;
  if (window.location.hash.replace('#','') !== hashPage) {
    history.replaceState({}, '', hashPage ? `#${hashPage}` : window.location.pathname);
  }

  window.scrollTo(0,0);
  if (page === 'home') { fetchHomeEvents(); fetchDiscoveryRows(); }
  if (page === 'browse') initBrowse();
  if (page === 'profile') {
    fetchProfile();
    fetchNotifCount();
    if (document.getElementById('ptab-events')?.classList.contains('active'))  fetchMyEvents();
    if (document.getElementById('ptab-tickets')?.classList.contains('active')) fetchMyTickets();
  }
  if (page === 'community') initCommunityFeed(false); // first load — show spinner
  if (page === 'host') {
    // Reset the publish mode selector and type selector every time host page is opened
    publishMode = 'publish';
    selectPublishMode('publish');
    document.getElementById('hostTypeSelect').style.display = '';
    document.getElementById('hostStepIndicators').style.display = 'none';
    document.getElementById('hostFormWrap').style.display = 'none';
    setHostStep(1);
  }
}

// Restore page from URL hash on load / back-forward navigation
function restorePageFromHash() {
  const raw   = window.location.hash.replace('#', '');
  const parts = raw.split('/');
  // #event/UUID → fetch event and open detail page
  if (parts[0] === 'event' && parts[1]) {
    loadEventById(parts[1]);
    return;
  }
  // #forum/UUID → fetch event then open its forum
  if (parts[0] === 'forum' && parts[1]) {
    loadEventForumById(parts[1]);
    return;
  }
  // #user/UUID → open that user's public profile
  if (parts[0] === 'user' && parts[1]) {
    const uid = parts[1];
    if (currentUser) {
      // Auth already resolved — open immediately
      setTimeout(() => openPublicProfile(uid), 200);
    } else {
      // Auth not yet resolved — park it; IIFE or sign-in will pick it up
      _pendingProfileUserId = uid;
    }
    return;
  }
  const valid = ['home','browse','community','host','profile','event-detail','forum'];
  if (raw && valid.includes(parts[0])) goTo(parts[0]);
}
window.addEventListener('hashchange', restorePageFromHash);

// Load a single event by ID (used for shared links)
async function loadEventById(id) {
  try {
    const res = await fetch(`${API_BASE}/api/events/${id}`);
    if (!res.ok) throw new Error('not found');
    const ev = await res.json();
    viewDetail(ev);
  } catch {
    goTo('browse');
    showToast('Event not found or no longer available.', 'error');
  }
}

async function loadEventForumById(eventId) {
  try {
    const res = await fetch(`${API_BASE}/api/events/${eventId}`);
    if (!res.ok) throw new Error('not found');
    const ev = await res.json();
    // Silently populate selectedEvent so the forum works correctly
    selectedEvent = ev;
    viewDetail(ev);           // sets up event data in the detail page
    openSheet('forumComingSoonSheet'); // forum coming soon
  } catch {
    goTo('browse');
    showToast('Event not found or no longer available.', 'error');
  }
}

// ═══════════════════════════════════════════════════════════
// SHEET SYSTEM
// ═══════════════════════════════════════════════════════════
function closeSheet(id) {
  document.getElementById(id).classList.remove('open');
  // Restore body scroll — undo iOS position:fixed lock
  document.body.style.overflow  = '';
  document.body.style.position  = '';
  document.body.style.width     = '';
  const scrollY = parseFloat(document.body.dataset.scrollY || '0');
  window.scrollTo(0, scrollY);
  document.body.dataset.scrollY = '';
  // When ticket sheet closes, destroy the Stripe card element so it remounts cleanly on next open
  if (id === 'ticketSheet' && cardEl) {
    cardEl.destroy();
    cardEl = null;
  }
  if (id === 'ticketSheet') {
    _appliedCoupon = null;
    const couponInput = document.getElementById('couponInput');
    if (couponInput) couponInput.value = '';
    const couponMsg = document.getElementById('couponMsg');
    if (couponMsg) couponMsg.style.display = 'none';
  }
}
document.querySelectorAll('.overlay, .sheet-overlay').forEach(o => {
  o.addEventListener('click', e => {
    if (e.target === o) {
      o.classList.remove('open');
      // Restore body scroll — undo iOS position:fixed lock
      document.body.style.overflow  = '';
      document.body.style.position  = '';
      document.body.style.width     = '';
      const scrollY = parseFloat(document.body.dataset.scrollY || '0');
      window.scrollTo(0, scrollY);
      document.body.dataset.scrollY = '';
      // Destroy Stripe card element if ticket sheet closed via backdrop
      if (o.id === 'ticketSheet' && cardEl) { cardEl.destroy(); cardEl = null; }
    }
  });
});

// ═══════════════════════════════════════════════════════════
// AUTH FLOW
// ═══════════════════════════════════════════════════════════
function openAuth(mode = 'signin', after = null) {
  authMode = mode;
  pendingAction = after;
  setAuthMode(mode);
  showAuthStep('auth-email');
  openSheet('authSheet');
}

function setAuthMode(mode) {
  authMode = mode;
  document.getElementById('tab-signin').classList.toggle('active', mode === 'signin');
  document.getElementById('tab-signup').classList.toggle('active', mode === 'signup');
  document.getElementById('nameGroup').style.display = mode === 'signup' ? 'block' : 'none';
  document.getElementById('tosGroup').style.display  = mode === 'signup' ? 'flex' : 'none';
  document.getElementById('authTitle').textContent = mode === 'signup' ? 'Join ChristLink' : 'Welcome Back';
  clearErr('err-email');
}

function showAuthStep(id) {
  document.querySelectorAll('.auth-step').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function clearErr(id) { const el = document.getElementById(id); if(el){el.textContent='';el.classList.remove('show');} }
function showErr(id, msg) { const el = document.getElementById(id); if(el){el.textContent=msg;el.classList.add('show');} }

async function sendOtp() {
  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const name  = document.getElementById('authName')?.value.trim() || '';
  clearErr('err-email');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showErr('err-email','Please enter a valid email address.'); return;
  }
  if (authMode === 'signup' && !document.getElementById('tosCheck').checked) {
    showErr('err-email','Please agree to the Terms of Service to continue.'); return;
  }
  if (authMode === 'signup' && !document.getElementById('privacyCheck').checked) {
    showErr('err-email','Please agree to the Privacy Policy to continue.'); return;
  }
  const btn = document.getElementById('sendOtpBtn');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div>&nbsp;Sending…';
  try {
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, data: { full_name: name || email.split('@')[0] } },
    });
    if (error) { showErr('err-email', error.message); btn.disabled=false; btn.innerHTML='Send Verification Code →'; return; }
    document.getElementById('otpEmailDisplay').textContent = email;
    showAuthStep('auth-otp');
    startResend();
    setTimeout(() => document.querySelector('.otp-box')?.focus(), 150);
  } catch {
    showErr('err-email','Something went wrong. Please try again.');
    btn.disabled=false; btn.innerHTML='Send Verification Code →';
  }
}

async function sendMagicLink() {
  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  if (!email) { showToast('Enter your email first', 'error'); return; }
  try {
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
    document.getElementById('magicLinkEmail').textContent = email;
    showAuthStep('auth-magic-sent');
  } catch (e) {
    showToast(e.message || 'Could not send link', 'error');
  }
}

async function resendOtp() {
  const email = document.getElementById('authEmail').value.trim();
  await sb.auth.signInWithOtp({ email, options:{ shouldCreateUser:true } });
  showToast('New code sent!');
  startResend();
}

function startResend() {
  let s = 30;
  const btn   = document.getElementById('resendBtn');
  const timer = document.getElementById('resendTimer');
  const count = document.getElementById('resendCount');
  btn.disabled = true; timer.style.display = 'inline'; count.textContent = s;
  clearInterval(resendTimer);
  resendTimer = setInterval(() => {
    s--; count.textContent = s;
    if (s <= 0) { clearInterval(resendTimer); btn.disabled=false; timer.style.display='none'; }
  }, 1000);
}

async function verifyOtp() {
  const email = document.getElementById('authEmail').value.trim();
  const digits = [...document.querySelectorAll('.otp-box')];
  const token  = digits.map(d => d.value).join('');
  clearErr('err-otp');
  if (token.length < 6) { showErr('err-otp','Enter the full 6-digit code.'); return; }
  const btn = document.getElementById('verifyOtpBtn');
  btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>&nbsp;Verifying…';
  try {
    const { data, error } = await sb.auth.verifyOtp({ email, token, type:'email' });
    if (error) {
      showErr('err-otp', error.message?.includes('expired') ? 'Code expired — request a new one.' : 'Invalid code. Please try again.');
      btn.disabled=false; btn.innerHTML='Verify Code'; return;
    }
    currentUser    = data.user;
    currentSession = data.session;
    const name = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Friend';
    document.getElementById('authSuccessTitle').textContent = authMode === 'signup' ? `Welcome, ${name}!` : `Good to see you, ${name}!`;
    document.getElementById('authSuccessSub').textContent   = 'You\'re all set.';
    showAuthStep('auth-success');
    spawnConfetti();
    isNewSignup = authMode === 'signup';
    syncAuthUI();
    setTimeout(() => {
      closeSheet('authSheet');
      if (pendingAction) { pendingAction(); pendingAction = null; }
      else if (isNewSignup) { showOnboarding(); isNewSignup = false; }
      if (_pendingProfileUserId) {
        const uid = _pendingProfileUserId; _pendingProfileUserId = null;
        setTimeout(() => openPublicProfile(uid), 300);
      }
    }, 1600);
  } catch {
    showErr('err-otp','Verification failed. Please try again.');
    btn.disabled=false; btn.innerHTML='Verify Code';
  }
}

// OTP keyboard wiring
document.addEventListener('DOMContentLoaded', () => {
  // ── Inject brand logos ────────────────────────────────────
  const headerMark = document.getElementById('headerLogoMark');
  if (headerMark) headerMark.innerHTML = LOGO_MARK;
  const homeFull = document.getElementById('homeLogoFull');
  if (homeFull) homeFull.innerHTML = LOGO_FULL;
  const authMark = document.getElementById('authLogoMark');
  if (authMark) authMark.innerHTML = LOGO_MARK;
  document.querySelectorAll('.footer-logo-mark').forEach(el => {
    el.style.cssText = 'width:16px;height:16px;border-radius:50%;overflow:hidden;flex-shrink:0;display:flex';
    el.innerHTML = `<img src="/icon-logo.png" alt="" style="width:100%;height:100%;object-fit:cover;display:block">`;
  });
  // ── Inject section icons ──────────────────────────────────
  const hotEl = document.getElementById('editHotTakesIcon');
  if (hotEl) hotEl.innerHTML = icon('prayerRequests', 14);
  const pubHot = document.getElementById('pubHotTakesIcon');
  if (pubHot) pubHot.innerHTML = icon('prayerRequests', 13);
  const pubHob = document.getElementById('pubHobbiesIcon');
  if (pubHob) pubHob.innerHTML = icon('goals', 13);
  const pubCon = document.getElementById('pubConnectIcon');
  if (pubCon) pubCon.innerHTML = icon('openToConnect', 13);
  const discTrI = document.getElementById('discTrendingIcon');
  if (discTrI) discTrI.innerHTML = icon('prayerRequests', 20);
  const discWoI = document.getElementById('discWorshipIcon');
  if (discWoI) discWoI.innerHTML = icon('worshipTeam', 20);
  const discFrI = document.getElementById('discFreeIcon');
  if (discFrI) discFrI.innerHTML = icon('giveSupport', 20);

  const boxes = document.querySelectorAll('.otp-box');
  boxes.forEach((box, i) => {
    box.addEventListener('input', e => {
      const v = e.target.value.replace(/\D/g,'');
      e.target.value = v ? v[0] : '';
      e.target.classList.toggle('filled', !!v);
      if (v && i < boxes.length - 1) boxes[i+1].focus();
      if ([...boxes].every(b => b.value)) verifyOtp();
    });
    box.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !box.value && i > 0) {
        boxes[i-1].value = ''; boxes[i-1].classList.remove('filled'); boxes[i-1].focus();
      }
    });
    box.addEventListener('paste', e => {
      const p = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6);
      if (p.length === 6) {
        e.preventDefault();
        boxes.forEach((b,j) => { b.value = p[j]||''; b.classList.toggle('filled',!!p[j]); });
        boxes[5].focus();
        setTimeout(verifyOtp, 100);
      }
    });
  });

  // post field expand
  const pf = document.getElementById('postInput');
  if (pf) {
    pf.addEventListener('focus', () => {
      document.getElementById('postSubmitRow').style.display = 'flex';
    });
  }

  // Build filter type chips
  const typeChips = document.getElementById('typeChips');
  EVENT_TYPES.forEach(t => {
    const d = document.createElement('div');
    d.className = 'filter-chip';
    d.dataset.filter = 'type';
    d.dataset.val    = t.toLowerCase();
    d.textContent = t;
    d.onclick = function(){ toggleFilterChip(this); };
    typeChips.appendChild(d);
  });

  // Verse carousel
  initVerses();

  // Init community feed placeholder
  initCommunityFeed(false);

  // Add first ticket row
  addTicketRow(true);
});

// ═══════════════════════════════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════════════════════════════
function showOnboarding() {
  const name = currentUser?.user_metadata?.full_name || '';
  document.getElementById('obName').value = name;
  document.getElementById('obCity').value = '';
  document.getElementById('obBio').value  = '';
  document.getElementById('ob-step-1').style.display = 'block';
  document.getElementById('ob-step-2').style.display = 'none';
  document.getElementById('obStepNum').textContent = '1';
  obAvatarColor = null; obAvatarUrl = null;
  buildObGrid(name || 'U');
  openSheet('onboardingSheet');
}

function buildObGrid(name) {
  const grid = document.getElementById('obColorGrid');
  grid.innerHTML = '';
  AVATAR_COLORS.forEach((bg, i) => {
    const btn = document.createElement('button');
    btn.className = 'ob-color-btn' + (i===0?' sel':'');
    btn.style.background = bg;
    btn.textContent = name.charAt(0).toUpperCase();
    btn.onclick = () => {
      obAvatarColor = bg; obAvatarUrl = null;
      grid.querySelectorAll('.ob-color-btn').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
      const prev = document.getElementById('obAvatarPreview');
      prev.style.background = bg; prev.textContent = name.charAt(0).toUpperCase();
      prev.innerHTML = '';
      prev.style.color = '#000';
      const span = document.createElement('span');
      span.textContent = name.charAt(0).toUpperCase();
      prev.appendChild(span);
    };
    grid.appendChild(btn);
  });
  // auto-select first
  obAvatarColor = AVATAR_COLORS[0];
  const prev = document.getElementById('obAvatarPreview');
  prev.style.background = AVATAR_COLORS[0];
  prev.innerHTML = `<span>${name.charAt(0).toUpperCase()}</span>`;
}

function obNext() {
  const name = document.getElementById('obName').value.trim();
  const err  = document.getElementById('obErr1');
  if (!name) { err.textContent='Please enter your name.'; err.classList.add('show'); return; }
  err.classList.remove('show');
  buildObGrid(name);
  document.getElementById('ob-step-1').style.display = 'none';
  document.getElementById('ob-step-2').style.display = 'block';
  document.getElementById('obStepNum').textContent = '2';
}

function obBack() {
  document.getElementById('ob-step-1').style.display = 'block';
  document.getElementById('ob-step-2').style.display = 'none';
  document.getElementById('obStepNum').textContent = '1';
}

function obHandlePhoto(input) {
  const file = input.files[0]; if (!file) return;
  const r = new FileReader();
  r.onload = e => {
    obAvatarUrl = e.target.result; obAvatarColor = null;
    const prev = document.getElementById('obAvatarPreview');
    prev.innerHTML = '';
    prev.style.background = 'transparent';
    const img = document.createElement('img');
    img.src = e.target.result;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%';
    prev.appendChild(img);
    document.querySelectorAll('.ob-color-btn').forEach(b => b.classList.remove('sel'));
  };
  r.readAsDataURL(file);
}

async function obFinish() {
  const btn = document.getElementById('obFinishBtn');
  btn.disabled = true; btn.innerHTML = '<div class="spinner spinner-gold"></div>&nbsp;Saving…';
  const updates = {
    full_name:    document.getElementById('obName').value.trim(),
    bio:          document.getElementById('obBio').value.trim(),
    city:         document.getElementById('obCity').value.trim(),
    avatar_color: obAvatarColor,
    avatar_url:   null,
  };
  if (obAvatarUrl?.startsWith('data:')) {
    try {
      const upRes = await fetch(`${API_BASE}/api/upload-avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
        body: JSON.stringify({ dataUrl: obAvatarUrl }),
      });
      const upData = await upRes.json();
      if (upRes.ok && upData.url) updates.avatar_url = upData.url;
    } catch {}
  }
  try {
    await fetch(`${API_BASE}/api/profile`, {
      method:'PATCH',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${currentSession?.access_token}`},
      body: JSON.stringify(updates),
    });
    profileData = {...profileData, ...updates};
  } catch { profileData = {...profileData, ...updates}; }
  await sb.auth.updateUser({ data:{ full_name: updates.full_name } });
  closeSheet('onboardingSheet');
  syncAuthUI();
  renderProfilePage();
  showToast('Welcome to ChristLink!','success');
  spawnConfetti();
  btn.disabled=false; btn.innerHTML='Finish Setup';
}

// ═══════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════
async function fetchProfile() {
  if (!currentUser) return;
  try {
    const res = await fetch(`${API_BASE}/api/profile`, {
      headers:{ 'Authorization':`Bearer ${currentSession?.access_token}` }
    });
    if (res.ok) { profileData = await res.json(); }
  } catch {
    profileData = {
      full_name:  currentUser.user_metadata?.full_name,
      bio: '', city: '', avatar_url: null,
    };
  }
  syncAuthUI();
  renderProfilePage();
  // Pre-fetch counts for stats
  fetchMyEvents(true);
  fetchMyTickets(true);
}

/* ── EMPTY STATE HELPERS ─────────────────────────────────── */
const EMPTY_SVGS = {
  events: `<svg class="empty-svg" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="22" width="72" height="58" rx="10" stroke="currentColor" stroke-width="3" fill="none" opacity=".4"/>
    <rect x="12" y="22" width="72" height="18" rx="10" fill="currentColor" opacity=".15"/>
    <line x1="28" y1="14" x2="28" y2="30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <line x1="68" y1="14" x2="68" y2="30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <rect x="30" y="54" width="16" height="16" rx="4" fill="currentColor" opacity=".3"/>
    <rect x="50" y="54" width="16" height="16" rx="4" fill="currentColor" opacity=".15"/>
  </svg>`,
  tickets: `<svg class="empty-svg" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 38 C10 30 16 24 24 24 L72 24 C80 24 86 30 86 38 L86 44 C82 44 79 47 79 51 C79 55 82 58 86 58 L86 64 C86 72 80 78 72 78 L24 78 C16 78 10 72 10 64 L10 58 C14 58 17 55 17 51 C17 47 14 44 10 44 Z" stroke="currentColor" stroke-width="3" fill="none" opacity=".4"/>
    <line x1="38" y1="24" x2="38" y2="78" stroke="currentColor" stroke-width="2" stroke-dasharray="5 4" opacity=".3"/>
    <line x1="50" y1="45" x2="70" y2="45" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity=".35"/>
    <line x1="50" y1="53" x2="62" y2="53" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity=".25"/>
  </svg>`,
  search: `<svg class="empty-svg" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="42" cy="42" r="26" stroke="currentColor" stroke-width="3" fill="none" opacity=".4"/>
    <line x1="61" y1="61" x2="82" y2="82" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".4"/>
    <line x1="33" y1="42" x2="51" y2="42" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity=".3"/>
    <line x1="42" y1="33" x2="42" y2="51" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity=".3"/>
  </svg>`,
};
function emptyStateHTML(type, title, sub, btnLabel, btnAction) {
  const icon = EMPTY_SVGS[type] || `<div class="empty-icon"><svg width="52" height="52" viewBox="0 0 32 32" fill="none"><rect x="7" y="7" width="18" height="22" rx="2" stroke="#C9A84C" stroke-width="2"/><path d="M12 7 L12 5 C12 4 13 3 14 3 L18 3 C19 3 20 4 20 5 L20 7" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="11" y1="14" x2="21" y2="14" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="11" y1="18" x2="21" y2="18" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg></div>`;
  const btn  = btnLabel ? `<button class="btn btn-gold btn-sm" style="margin-top:8px" onclick="${btnAction}">${btnLabel}</button>` : '';
  return `<div class="empty-state" style="color:var(--muted2)">${icon}<div class="empty-title">${title}</div><div class="empty-sub">${sub}</div>${btn}</div>`;
}

async function fetchMyEvents(countOnly = false) {
  if (!currentUser) return;
  try {
    const res = await fetch(`${API_BASE}/api/my-events`, {
      headers:{ 'Authorization':`Bearer ${currentSession?.access_token}` }
    });
    if (!res.ok) throw new Error('failed');
    const data = await res.json();
    const events = data.events || [];
    // update stat
    document.getElementById('statEvents').textContent = events.length;
    // always render preview in overview tab
    renderHostedEventsPreview(events);
    if (countOnly) return;
    // render into tab
    const container = document.getElementById('myEventsContainer');
    if (!container) return;
    if (events.length === 0) {
      container.innerHTML = emptyStateHTML('events', 'No events yet', 'Events you host will appear here.', 'Host an Event →', "goTo('host')");
      return;
    }
    container.innerHTML = '';
    events.forEach(ev => {
      const el = makeHostedEventCard(ev);
      container.appendChild(el);
    });
  } catch {
    if (countOnly) return;
    const container = document.getElementById('myEventsContainer');
    if (container) container.innerHTML = emptyStateHTML('events', 'No events yet', 'Events you host will appear here.', 'Host an Event →', "goTo('host')");
  }
}

async function fetchMyTickets(countOnly = false) {
  if (!currentUser) return;
  try {
    const headers = { 'Authorization': `Bearer ${currentSession?.access_token}` };
    const [ticketRes, rsvpRes] = await Promise.all([
      fetch(`${API_BASE}/api/my-tickets`, { headers }),
      fetch(`${API_BASE}/api/my-rsvps`,   { headers }),
    ]);
    const allTickets = ticketRes.ok ? (await ticketRes.json()).tickets || [] : [];
    // Only show confirmed/refunded tickets — filter out incomplete pending payments
    const tickets = allTickets.filter(t => t.status !== 'pending' && t.status !== 'failed');
    const rsvps   = rsvpRes.ok  ? (await rsvpRes.json()).rsvps     || [] : [];
    const total   = tickets.length + rsvps.length;
    const statEl = document.getElementById('statTickets');
    if (statEl) statEl.textContent = total;
    if (countOnly) return;
    const container = document.getElementById('myTicketsContainer');
    if (!container) return;
    if (total === 0) {
      container.innerHTML = emptyStateHTML('tickets', 'No tickets yet', 'Tickets and RSVPs you register for will appear here.', 'Explore Events →', "goTo('browse')");
      return;
    }
    container.innerHTML = '';
    tickets.forEach(t => { _ticketCache[t.id] = t; container.appendChild(makeTicketCard(t)); });
    rsvps.forEach(r   => container.appendChild(makeRsvpCard(r)));
  } catch {
    if (countOnly) return;
    const container = document.getElementById('myTicketsContainer');
    if (container) container.innerHTML = `<div class="empty-state">
      <div class="empty-icon"><svg width="52" height="52" viewBox="0 0 32 32" fill="none"><path d="M4 11 C4 9.5 5 9 6 9 L26 9 C27 9 28 9.5 28 11 C28 11 26 12 26 14 C26 16 28 17 28 17 C28 18.5 27 19 26 19 L6 19 C5 19 4 18.5 4 17 C4 17 6 16 6 14 C6 12 4 11 4 11Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><line x1="20" y1="9" x2="20" y2="19" stroke="#C9A84C" stroke-width="1.5" stroke-dasharray="2 2"/><path d="M8 13 L16 13 M8 15 L13 15" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg></div>
      <div class="empty-title">No tickets yet</div>
      <div class="empty-sub">Tickets and RSVPs will appear here.</div>
      <button class="btn btn-gold btn-sm mt-4" onclick="goTo('browse')">Explore Events →</button>
    </div>`;
  }
}

function makeHostedEventCard(ev) {
  const el = document.createElement('div');
  el.style.cssText = 'background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;margin-bottom:14px;cursor:pointer';
  const fmtDate = ev.start_date
    ? new Date(ev.start_date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})
    : 'Date TBD';
  const bg = ['linear-gradient(135deg,#1A0E38,#0F0F1A)','linear-gradient(135deg,#0E2438,#0F1A1A)','linear-gradient(135deg,#0E3820,#0F1A15)'][Math.abs((ev.name||'').charCodeAt(0))%3];
  const statusColor = ev.status === 'published' ? '#4EC98C' : ev.status === 'draft' ? '#C9A84C' : '#666070';
  const statusBg    = ev.status === 'published' ? 'rgba(78,201,140,.15)' : ev.status === 'draft' ? 'rgba(201,168,76,.12)' : 'rgba(102,96,112,.12)';
  el.innerHTML = `
    <!-- Cover image — full width banner -->
    <div style="position:relative;width:100%;height:160px;background:${bg};overflow:hidden;flex-shrink:0">
      ${ev.cover_url
        ? `<img alt="" src="${ev.cover_url}" style="width:100%;height:100%;object-fit:cover;display:block">`
        : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;display:flex;align-items:center;justify-content:center;opacity:.6"><svg width="40" height="40" viewBox="0 0 32 32" fill="none"><rect x="14" y="4" width="4" height="24" rx="1.5" fill="#C9A84C"/><rect x="6" y="11" width="20" height="4" rx="1.5" fill="#C9A84C"/></svg></div>`}
      <div style="position:absolute;top:10px;left:10px;font-size:11px;font-weight:700;color:${statusColor};background:${statusBg};border:1px solid ${statusColor}44;border-radius:var(--r-full);padding:3px 10px;text-transform:uppercase;letter-spacing:.06em;backdrop-filter:blur(6px)">${ev.status}</div>
      <div style="position:absolute;top:10px;right:10px;font-size:11px;font-weight:700;color:${ev.is_paid?'var(--gold)':'#4EC98C'};background:${ev.is_paid?'rgba(201,168,76,.18)':'rgba(78,201,140,.15)'};border:1px solid ${ev.is_paid?'rgba(201,168,76,.4)':'rgba(78,201,140,.35)'};border-radius:var(--r-full);padding:3px 10px;backdrop-filter:blur(6px)">${ev.is_paid?'Paid':'Free'}</div>
    </div>
    <!-- Info section -->
    <div style="padding:14px 14px 10px">
      <div style="font-family:var(--font-display);font-size:17px;font-weight:700;margin-bottom:5px;line-height:1.25;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${escapeHtml(ev.name)}</div>
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="color:var(--muted);flex-shrink:0"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span style="font-size:12px;color:var(--muted2)">${fmtDate}</span>
        ${ev.city ? `<span style="font-size:12px;color:var(--muted)">·</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="color:var(--muted);flex-shrink:0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span style="font-size:12px;color:var(--muted2)">${escapeHtml(ev.city)}${ev.state?', '+escapeHtml(ev.state):''}</span>` : ''}
      </div>
      ${ev.description ? `<div style="font-size:12px;color:var(--muted);line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;margin-bottom:2px">${escapeHtml(ev.description)}</div>` : ''}
    </div>
    <!-- Action buttons — wrapping pill row -->
    <div style="display:flex;flex-wrap:wrap;gap:7px;padding:8px 14px 14px;border-top:1px solid var(--border)">
      <button class="ev-btn-view" style="font-size:12px;font-weight:600;color:var(--gold);background:var(--gold-dim);border:1px solid rgba(201,168,76,.3);padding:6px 14px;border-radius:var(--r-full);cursor:pointer;touch-action:manipulation">View</button>
      <button class="ev-btn-edit" style="font-size:12px;font-weight:600;color:#7EB8F7;background:rgba(126,184,247,.1);border:1px solid rgba(126,184,247,.25);padding:6px 14px;border-radius:var(--r-full);cursor:pointer;touch-action:manipulation">Edit</button>
      ${ev.status === 'published' ? `<button class="ev-btn-scan" style="font-size:12px;font-weight:600;color:#4EC98C;background:rgba(78,201,140,.1);border:1px solid rgba(78,201,140,.25);padding:6px 14px;border-radius:var(--r-full);cursor:pointer;touch-action:manipulation">Scan</button>` : ''}
      ${ev.status === 'published' ? `<button class="ev-btn-sales" style="font-size:12px;font-weight:600;color:#A882FF;background:rgba(168,130,255,.1);border:1px solid rgba(168,130,255,.25);padding:6px 14px;border-radius:var(--r-full);cursor:pointer;touch-action:manipulation">Sales</button>` : ''}
      <button class="ev-btn-toggle" style="font-size:12px;font-weight:600;color:${ev.status==='published'?'var(--gold)':'#4EC98C'};background:${ev.status==='published'?'rgba(201,168,76,.1)':'rgba(78,201,140,.1)'};border:1px solid ${ev.status==='published'?'rgba(201,168,76,.3)':'rgba(78,201,140,.3)'};padding:6px 14px;border-radius:var(--r-full);cursor:pointer;touch-action:manipulation">${ev.status==='published'?'Unpublish':'Publish'}</button>
      <button class="ev-btn-share" style="font-size:12px;font-weight:600;color:var(--muted2);background:var(--surface3);border:1px solid var(--border);padding:6px 14px;border-radius:var(--r-full);cursor:pointer;touch-action:manipulation">Share</button>
      <button class="ev-btn-dup" style="font-size:12px;font-weight:600;color:var(--muted2);background:var(--surface3);border:1px solid var(--border);padding:6px 14px;border-radius:var(--r-full);cursor:pointer;touch-action:manipulation">Duplicate</button>
      <button class="ev-btn-del" style="font-size:12px;font-weight:600;color:var(--red);background:rgba(224,80,80,.08);border:1px solid rgba(224,80,80,.2);padding:6px 14px;border-radius:var(--r-full);cursor:pointer;touch-action:manipulation">Delete</button>
    </div>`;

  // Wire all buttons via closures — no inline JSON, no string encoding issues
  const q = cls => el.querySelector(cls);
  q('.ev-btn-view') ?.addEventListener('click', e => { e.stopPropagation(); viewDetail(ev); goTo('event-detail'); });
  q('.ev-btn-edit') ?.addEventListener('click', e => { e.stopPropagation(); openEditEventSheet(ev); });
  q('.ev-btn-scan') ?.addEventListener('click', e => { e.stopPropagation(); openScannerSheet(ev.id, encodeURIComponent(ev.name || '')); });
  q('.ev-btn-sales')?.addEventListener('click', e => { e.stopPropagation(); openEventSales(ev.id); });
  q('.ev-btn-toggle')?.addEventListener('click', e => { e.stopPropagation(); toggleEventVisibility(ev.id, ev.status, e.currentTarget); });
  q('.ev-btn-share') ?.addEventListener('click', e => { e.stopPropagation(); shareEventById(ev.id, ev.name || '', ev.description || '', e.currentTarget); });
  q('.ev-btn-dup')  ?.addEventListener('click', e => { e.stopPropagation(); duplicateEvent(ev.id, e.currentTarget); });
  q('.ev-btn-del')  ?.addEventListener('click', e => { e.stopPropagation(); confirmDeleteEvent(ev.id); });
  el.addEventListener('click', () => { viewDetail(ev); goTo('event-detail'); });
  return el;
}

function makeTicketCard(t) {
  const el = document.createElement('div');
  // Chamfered (diagonal) corners — matching classic ticket outline
  el.style.cssText = 'background:linear-gradient(160deg,#1C1030 0%,#0E0E1C 100%);margin-bottom:16px;cursor:pointer;position:relative;clip-path:polygon(12px 0%,calc(100% - 12px) 0%,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%,12px 100%,0% calc(100% - 12px),0% 12px);box-shadow:0 0 0 1.5px rgba(201,168,76,.45),0 6px 28px rgba(0,0,0,.5)';
  const fmtDate = t.event_start_date
    ? new Date(t.event_start_date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})
    : 'Date TBD';
  const statusColor = t.status === 'confirmed' ? 'var(--green)' : t.status === 'pending' ? 'var(--gold)' : 'var(--muted)';
  const isPaid = t.total_charged_cents > 0;
  const shortCode = t.code || (t.stripe_payment_intent
    ? t.stripe_payment_intent.replace(/[^a-zA-Z0-9]/g,'').slice(-8).toUpperCase()
    : t.id?.replace(/-/g,'').slice(0,8).toUpperCase() || '—');
  const canRefund = t.status === 'confirmed' && isPaid;
  // Sawtooth perforation SVG — matches the tear-line on a classic ticket
  const sawteeth = '0,7 5,1 10,13 15,1 20,13 25,1 30,13 35,1 40,13 45,1 50,13 55,1 60,13 65,1 70,13 75,1 80,13 85,1 90,13 95,1 100,13 105,1 110,13 115,1 120,13 125,1 130,13 135,1 140,13 145,1 150,13 155,1 160,13 165,1 170,13 175,1 180,13 185,1 190,13 195,1 200,13 205,1 210,13 215,1 220,13 225,1 230,13 235,1 240,13 245,1 250,13 255,1 260,13 265,1 270,13 275,1 280,13 285,1 290,13 295,1 300,7';
  el.innerHTML = `
    <!-- TICKET BODY -->
    <div style="display:flex;gap:12px;padding:14px 16px 13px;align-items:center;position:relative">
      <div style="width:52px;height:52px;border-radius:8px;flex-shrink:0;overflow:hidden;background:linear-gradient(135deg,#1A0E38,#0F0F1A);display:flex;align-items:center;justify-content:center">
        ${t.event_cover_url ? `<img alt="" src="${t.event_cover_url}" style="width:100%;height:100%;object-fit:cover">` : '<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M4 11 C4 9.5 5 9 6 9 L26 9 C27 9 28 9.5 28 11 C28 11 26 12 26 14 C26 16 28 17 28 17 C28 18.5 27 19 26 19 L6 19 C5 19 4 18.5 4 17 C4 17 6 16 6 14 C6 12 4 11 4 11Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/></svg>'}
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px">${escapeHtml(t.event_name || 'Event')}</div>
        <div style="font-size:12px;color:var(--muted2);margin-bottom:4px">${fmtDate}</div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-size:11px;font-weight:700;color:${statusColor};text-transform:uppercase;letter-spacing:.05em">${t.status}</span>
          <span style="font-size:11px;color:var(--muted)">${t.quantity} ticket${t.quantity!==1?'s':''}</span>
          ${isPaid ? `<span style="font-size:11px;color:var(--gold);font-weight:600">$${((t.total_charged_cents||0)/100).toFixed(2)}</span>` : '<span style="font-size:11px;color:var(--muted)">Free</span>'}
        </div>
      </div>
      ${t.status === 'confirmed' ? `
      <button class="ticket-menu-btn" aria-label="Options"
        style="position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;touch-action:manipulation;color:var(--muted2)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
      </button>
      <div class="ticket-dropdown" style="display:none;position:absolute;top:38px;right:8px;z-index:100;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);min-width:170px;box-shadow:0 8px 24px rgba(0,0,0,.4);overflow:hidden">
        <button class="td-view" style="display:flex;align-items:center;gap:10px;width:100%;padding:12px 16px;background:none;border:none;color:var(--text);font-size:14px;cursor:pointer;text-align:left">
          <svg width="13" height="13" viewBox="0 0 32 32" fill="none" style="vertical-align:middle;margin-right:5px"><path d="M4 11 C4 9.5 5 9 6 9 L26 9 C27 9 28 9.5 28 11 C28 11 26 12 26 14 C26 16 28 17 28 17 C28 18.5 27 19 26 19 L6 19 C5 19 4 18.5 4 17 C4 17 6 16 6 14 C6 12 4 11 4 11Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>View Ticket
        </button>
        <button class="td-share" style="display:flex;align-items:center;gap:10px;width:100%;padding:12px 16px;background:none;border:none;color:var(--text);font-size:14px;cursor:pointer;text-align:left">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          Share Event
        </button>
        ${canRefund ? `
        <div style="height:1px;background:var(--border);margin:2px 0"></div>
        <button class="td-refund" style="display:flex;align-items:center;gap:10px;width:100%;padding:12px 16px;background:none;border:none;color:#ef4444;font-size:14px;cursor:pointer;text-align:left">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
          Request Refund
        </button>` : ''}
      </div>` : ''}
    </div>
    <!-- SAWTOOTH PERFORATION (classic ticket tear-line) -->
    ${t.status === 'confirmed' ? `
    <svg width="100%" height="14" viewBox="0 0 300 14" preserveAspectRatio="none" style="display:block;overflow:visible">
      <polyline points="${sawteeth}" fill="none" stroke="rgba(201,168,76,.55)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>
    <!-- Stub -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 16px 12px;gap:10px">
      <div style="font-size:11px;font-weight:700;color:var(--muted2);letter-spacing:.14em;font-family:monospace">${shortCode}</div>
      <button class="view-ticket-btn" style="height:33px;padding:0 16px;border-radius:999px;background:linear-gradient(135deg,#C9A84C 0%,#FFE57A 28%,#D4A520 50%,#8B6010 72%,#C9A84C 88%,#FFE57A 100%);color:#000;font-size:12px;font-weight:800;border:none;cursor:pointer;touch-action:manipulation;box-shadow:0 2px 10px rgba(201,168,76,.4),inset 0 1px 0 rgba(255,255,255,.4)">
        View Ticket
      </button>
    </div>` : `
    <div style="padding:8px 16px 12px">
      <span style="font-size:11px;font-weight:700;color:${statusColor};text-transform:uppercase;letter-spacing:.06em">${t.status}</span>
    </div>`}`;

  // 3-dot menu toggle
  const menuBtn = el.querySelector('.ticket-menu-btn');
  const dropdown = el.querySelector('.ticket-dropdown');
  if (menuBtn && dropdown) {
    menuBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = dropdown.style.display !== 'none';
      // Close all other open dropdowns
      document.querySelectorAll('.ticket-dropdown').forEach(d => { d.style.display = 'none'; });
      dropdown.style.display = isOpen ? 'none' : 'block';
    });
  }

  const closeDropdown = () => { if (dropdown) dropdown.style.display = 'none'; };

  const tdView = el.querySelector('.td-view');
  if (tdView) {
    tdView.addEventListener('click', e => { e.stopPropagation(); closeDropdown(); openTicketViewer(t); });
  }
  const tdShare = el.querySelector('.td-share');
  if (tdShare) {
    tdShare.addEventListener('click', e => { e.stopPropagation(); closeDropdown(); shareEventById(t.event_id, t.event_name || '', '', tdShare); });
  }
  const tdRefund = el.querySelector('.td-refund');
  if (tdRefund) {
    tdRefund.addEventListener('click', e => { e.stopPropagation(); closeDropdown(); openRefundRequestSheet(t); });
  }

  const viewBtn = el.querySelector('.view-ticket-btn');
  if (viewBtn) {
    viewBtn.addEventListener('click', e => { e.stopPropagation(); openTicketViewer(t); });
  }

  // Tapping the card body navigates to the event detail page
  el.addEventListener('click', e => {
    if (dropdown && dropdown.style.display !== 'none') { closeDropdown(); return; }
    if (t.event_id) {
      fetch(`${API_BASE}/api/events/${t.event_id}`)
        .then(r => r.json())
        .then(ev => { viewDetail(ev); goTo('event-detail'); })
        .catch(() => showToast('Could not load event', 'error'));
    }
  });
  return el;
}

function makeRsvpCard(r) {
  const el = document.createElement('div');
  el.style.cssText = 'background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;margin-bottom:12px;cursor:pointer';
  const fmtDate = r.event_start_date
    ? new Date(r.event_start_date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})
    : 'Date TBD';
  el.innerHTML = `
    <div style="display:flex;gap:12px;padding:14px 16px;align-items:center">
      <div style="width:48px;height:48px;border-radius:var(--r-sm);flex-shrink:0;overflow:hidden;background:linear-gradient(135deg,#0E3820,#0F1A15);display:flex;align-items:center;justify-content:center;font-size:22px">
        ${r.event_cover_url ? `<img alt="" src="${r.event_cover_url}" style="width:100%;height:100%;object-fit:cover">` : '<svg width="40" height="40" viewBox="0 0 32 32" fill="none"><rect x="14" y="4" width="4" height="24" rx="1.5" fill="#C9A84C"/><rect x="6" y="11" width="20" height="4" rx="1.5" fill="#C9A84C"/></svg>'}
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px">${escapeHtml(r.event_name || 'Event')}</div>
        <div style="font-size:12px;color:var(--muted2);margin-bottom:4px">${fmtDate} · ${r.event_city || ''}</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:11px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.05em"><svg width="11" height="11" viewBox="0 0 14 14" fill="none" style="vertical-align:middle;margin-right:2px"><path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Going</span>
          <span style="font-size:11px;color:var(--muted)">Free</span>
        </div>
      </div>
      <button onclick="event.stopPropagation();cancelRsvpFromTickets('${r.event_id}',this)" style="flex-shrink:0;font-size:12px;font-weight:600;color:var(--muted2);background:transparent;border:1px solid var(--border);padding:7px 12px;border-radius:var(--r-full)">
        Cancel
      </button>
    </div>`;
  el.onclick = () => {
    if (r.event_id) {
      fetch(`${API_BASE}/api/events/${r.event_id}`)
        .then(res => res.json())
        .then(ev => { viewDetail(ev); goTo('event-detail'); })
        .catch(() => showToast('Could not load event', 'error'));
    }
  };
  return el;
}

async function cancelRsvpFromTickets(eventId, btn) {
  btn.disabled = true; btn.textContent = '…';
  try {
    const res = await fetch(`${API_BASE}/api/rsvp/${eventId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    if (res.ok) {
      btn.closest('div[style*="border-radius"]').remove();
      const cur = parseInt(document.getElementById('statTickets').textContent) || 1;
      document.getElementById('statTickets').textContent = Math.max(0, cur - 1);
      showToast('RSVP cancelled');
    } else { btn.disabled = false; btn.textContent = 'Cancel'; showToast('Could not cancel', 'error'); }
  } catch { btn.disabled = false; btn.textContent = 'Cancel'; }
}

function confirmDeleteEvent(id) {
  if (!confirm('Delete this event? This cannot be undone.')) return;
  deleteEvent(id);
}

async function deleteEvent(id) {
  try {
    const res = await fetch(`${API_BASE}/api/events/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` }
    });
    if (res.ok) {
      showToast('Event deleted','success');
      fetchMyEvents();
    } else {
      showToast('Could not delete event','error');
    }
  } catch { showToast('Could not delete event','error'); }
}

// ─── EDIT EVENT ──────────────────────────────────────────────
let selectedTicketTypeIdx = 0;

let editEventId         = null;
let eeeCoverFile        = null;   // File object of new cover photo
let eeeCoverB64         = null;   // Compressed data URL of new cover photo
let eeeCoverUrlOld      = null;   // Existing cover URL (kept if no new photo chosen)
let editGalleryNewFiles = [];
let editGalleryUrls     = [];
let editEventIsPaid     = false;

function openEditEventSheet(ev) {
  editEventId         = ev.id;
  eeeCoverFile        = null;
  eeeCoverB64         = null;
  eeeCoverUrlOld      = ev.cover_url || null;
  editGalleryNewFiles = [];
  editGalleryUrls     = ev.gallery_urls ? [...ev.gallery_urls] : [];
  editEventIsPaid     = ev.is_paid;

  // Cover photo preview
  const preview     = document.getElementById('eeeCoverPreview');
  const placeholder = document.getElementById('eeeCoverPlaceholder');
  const badge       = document.getElementById('eeeCoverChangeBadge');
  if (ev.cover_url) {
    preview.src = ev.cover_url;
    preview.style.display = 'block';
    placeholder.style.display = 'none';
    badge.style.display = 'block';
  } else {
    preview.src = '';
    preview.style.display = 'none';
    placeholder.style.display = 'flex';
    badge.style.display = 'none';
  }

  // Gallery — render existing + new
  renderEeeGalleryGrid();

  // Text fields
  document.getElementById('eeeName').value           = ev.name         || '';
  document.getElementById('eeeType').value           = ev.event_type   || '';
  document.getElementById('eeeFormat').value         = ev.format       || 'in_person';
  document.getElementById('eeeAgeGroup').value       = ev.age_group    || 'All Ages';
  document.getElementById('eeeDenomination').value   = ev.denomination || '';
  document.getElementById('eeeDesc').value           = ev.description  || '';
  document.getElementById('eeeStartDate').value      = isoToLocalInput(ev.start_date);
  document.getElementById('eeeEndDate').value        = isoToLocalInput(ev.end_date);
  document.getElementById('eeeSalesCutoff').value    = isoToLocalInput(ev.sales_cutoff || ev.end_date);
  document.getElementById('eeeVenue').value          = ev.venue_name   || '';
  document.getElementById('eeeAddress').value        = ev.address      || '';
  document.getElementById('eeeCity').value           = ev.city         || '';
  document.getElementById('eeeState').value          = ev.state        || '';
  document.getElementById('eeeCapacity').value       = ev.max_capacity || '';
  document.getElementById('eeeOnlineUrl').value      = ev.online_url   || '';
  document.getElementById('eeeForumEnabled').checked = !!ev.forum_enabled;
  document.getElementById('eeeErr').textContent      = '';

  // Ticket types section
  const ticketSection = document.getElementById('eeeTicketSection');
  const ticketList    = document.getElementById('eeeTicketList');
  ticketList.innerHTML = '';
  if (ev.is_paid) {
    ticketSection.style.display = 'block';
    (ev.ticket_types || []).forEach(tt => renderEeeExistingTicket(tt));
  } else {
    ticketSection.style.display = 'none';
  }

  openSheet('editEventSheet');
  // Load existing coupons — always visible (free events can still use promo codes)
  document.getElementById('eeeCouponSection').style.display = 'block';
  loadEeeCoupons(ev.id);
}

function handleEditCoverPhoto(input) {
  const file = input.files[0]; if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5MB', 'error'); return; }
  eeeCoverFile = file;
  const r = new FileReader();
  r.onload = e => {
    // Compress to max 1200px JPEG — keeps upload fast
    const srcImg = new Image();
    srcImg.onload = () => {
      const MAX = 1200;
      const scale = Math.min(1, MAX / Math.max(srcImg.width, srcImg.height));
      const canvas = document.createElement('canvas');
      canvas.width  = Math.round(srcImg.width  * scale);
      canvas.height = Math.round(srcImg.height * scale);
      canvas.getContext('2d').drawImage(srcImg, 0, 0, canvas.width, canvas.height);
      eeeCoverB64 = canvas.toDataURL('image/jpeg', 0.82);
      const preview     = document.getElementById('eeeCoverPreview');
      const placeholder = document.getElementById('eeeCoverPlaceholder');
      const badge       = document.getElementById('eeeCoverChangeBadge');
      preview.src = eeeCoverB64;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
      badge.style.display = 'block';
    };
    srcImg.src = e.target.result;
  };
  r.readAsDataURL(file);
}

function handleEditGalleryPhotos(input) {
  const files = [...input.files]; if (!files.length) return;
  const total     = editGalleryUrls.length + editGalleryNewFiles.length;
  const remaining = 6 - total;
  if (remaining <= 0) { showToast('Maximum 6 gallery photos','error'); return; }
  let added = 0;
  files.slice(0, remaining).forEach(file => {
    if (file.size > 5 * 1024 * 1024) { showToast(`${file.name} over 5MB — skipped`,'error'); return; }
    editGalleryNewFiles.push(file);
    added++;
  });
  if (added > 0) renderEeeGalleryGrid();
  input.value = ''; // allow re-selecting same files
}

function renderEeeGalleryGrid() {
  const grid = document.getElementById('eeeGalleryGrid');
  grid.innerHTML = '';
  editGalleryUrls.forEach((url, i) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;aspect-ratio:1;border-radius:var(--r-sm);overflow:hidden;background:var(--surface3)';
    wrap.innerHTML = `
      <img alt="" src="${url}" style="width:100%;height:100%;object-fit:cover">
      <button type="button" onclick="removeEeeExisting(${i})"
        style="position:absolute;top:4px;right:4px;width:22px;height:22px;border-radius:50%;
        background:rgba(0,0,0,.75);color:#fff;font-size:13px;display:flex;align-items:center;
        justify-content:center;border:none;cursor:pointer">×</button>`;
    grid.appendChild(wrap);
  });
  editGalleryNewFiles.forEach((file, i) => {
    const url = URL.createObjectURL(file);
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;aspect-ratio:1;border-radius:var(--r-sm);overflow:hidden;background:var(--surface3)';
    wrap.innerHTML = `
      <img alt="" src="${url}" style="width:100%;height:100%;object-fit:cover">
      <button type="button" onclick="removeEeeNew(${i})"
        style="position:absolute;top:4px;right:4px;width:22px;height:22px;border-radius:50%;
        background:rgba(0,0,0,.75);color:#fff;font-size:13px;display:flex;align-items:center;
        justify-content:center;border:none;cursor:pointer">×</button>`;
    grid.appendChild(wrap);
  });
  document.getElementById('eeeGalleryAddBtn').style.opacity =
    (editGalleryUrls.length + editGalleryNewFiles.length) >= 6 ? '0.4' : '1';
}

function removeEeeExisting(idx) {
  editGalleryUrls.splice(idx, 1);
  renderEeeGalleryGrid();
}

function removeEeeNew(idx) {
  editGalleryNewFiles.splice(idx, 1);
  renderEeeGalleryGrid();
}

// Keep old name as no-op for any stale HTML (shouldn't be called anymore)
function removeEeeGalleryThumb() {}

function renderEeeExistingTicket(tt) {
  const list = document.getElementById('eeeTicketList');
  const row  = document.createElement('div');
  row.className = 'ticket-row';
  row.setAttribute('data-tt-id', tt.id);
  row.innerHTML = `
    <div>
      <div class="ticket-row-label">Name</div>
      <input data-field="name" value="${escapeHtml(tt.name||'')}" placeholder="General Admission"
        style="background:var(--surface3);border:1px solid var(--border);border-radius:var(--r-sm);padding:9px 12px;font-size:14px;color:var(--text);width:100%">
    </div>
    <div>
      <div class="ticket-row-label">Price ($)</div>
      <input type="number" data-field="price" value="${tt.price_cents?(tt.price_cents/100).toFixed(2):''}" placeholder="0.00" min="0.01" step="0.01"
        style="background:var(--surface3);border:1px solid var(--border);border-radius:var(--r-sm);padding:9px 12px;font-size:14px;color:var(--text);width:100%">
    </div>
    <div>
      <div class="ticket-row-label">Qty</div>
      <input type="number" data-field="qty" value="${tt.quantity||''}" placeholder="∞" min="1"
        style="background:var(--surface3);border:1px solid var(--border);border-radius:var(--r-sm);padding:9px 12px;font-size:14px;color:var(--text);width:100%">
    </div>
    <div style="display:flex;align-items:flex-end;padding-bottom:4px">
      <span style="font-size:11px;color:var(--muted);white-space:nowrap">${tt.sold||0} sold</span>
    </div>`;
  list.appendChild(row);
}

function addEeeTicketRow() {
  const list = document.getElementById('eeeTicketList');
  const row  = document.createElement('div');
  row.className = 'ticket-row';
  row.setAttribute('data-tt-id', 'new');
  row.innerHTML = `
    <div>
      <div class="ticket-row-label">Name</div>
      <input data-field="name" placeholder="General Admission"
        style="background:var(--surface3);border:1px solid var(--border);border-radius:var(--r-sm);padding:9px 12px;font-size:14px;color:var(--text);width:100%">
    </div>
    <div>
      <div class="ticket-row-label">Price ($)</div>
      <input type="number" data-field="price" placeholder="0.00" min="0.01" step="0.01"
        style="background:var(--surface3);border:1px solid var(--border);border-radius:var(--r-sm);padding:9px 12px;font-size:14px;color:var(--text);width:100%">
    </div>
    <div>
      <div class="ticket-row-label">Qty</div>
      <input type="number" data-field="qty" placeholder="∞" min="1"
        style="background:var(--surface3);border:1px solid var(--border);border-radius:var(--r-sm);padding:9px 12px;font-size:14px;color:var(--text);width:100%">
    </div>
    <button type="button" onclick="this.parentElement.remove()" class="remove-tt">×</button>`;
  list.appendChild(row);
}

async function saveEditEvent() {
  const name  = document.getElementById('eeeName').value.trim();
  const errEl = document.getElementById('eeeErr');
  if (!name) { errEl.textContent = 'Event name is required.'; errEl.classList.add('show'); return; }
  errEl.classList.remove('show');
  const btn = document.getElementById('eeeSaveBtn');
  btn.disabled = true; btn.innerHTML = '<div class="spinner spinner-gold"></div>&nbsp;Saving…';

  try {
    // Upload cover photo via server-side route (bypasses RLS)
    let coverUrl = eeeCoverUrlOld;
    if (eeeCoverFile && eeeCoverB64) {
      btn.innerHTML = '<div class="spinner spinner-gold"></div>&nbsp;Uploading photo…';
      try {
        const upRes = await fetch(`${API_BASE}/api/upload-event-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
          body: JSON.stringify({ dataUrl: eeeCoverB64, type: 'cover' }),
        });
        const upData = await upRes.json();
        if (upRes.ok) coverUrl = upData.url;
        else showToast('Photo upload failed — other changes will still save', 'error');
      } catch(e) {
        showToast('Photo upload failed — other changes will still save', 'error');
      }
      btn.innerHTML = '<div class="spinner spinner-gold"></div>&nbsp;Saving…';
    }

    // Upload new gallery photos
    const allGalleryUrls = [...editGalleryUrls];
    if (editGalleryNewFiles.length) {
      btn.innerHTML = '<div class="spinner spinner-gold"></div>&nbsp;Uploading photos…';
      let galleryFailed = 0;
      for (const file of editGalleryNewFiles) {
        try {
          const dataUrl = (typeof file === 'string' && file.startsWith('data:'))
            ? file
            : await new Promise((res, rej) => {
                const r = new FileReader(); r.onload = e => res(e.target.result); r.onerror = rej; r.readAsDataURL(file);
              });
          const upRes = await fetch(`${API_BASE}/api/upload-event-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
            body: JSON.stringify({ dataUrl, type: 'gallery' }),
          });
          const upData = await upRes.json();
          if (upRes.ok) allGalleryUrls.push(upData.url);
          else galleryFailed++;
        } catch { galleryFailed++; }
      }
      if (galleryFailed > 0) showToast(`${galleryFailed} photo(s) failed to upload`, 'error');
    }

    btn.innerHTML = '<div class="spinner spinner-gold"></div>&nbsp;Saving…';
    const cap  = document.getElementById('eeeCapacity').value;
    const body = {
      name,
      cover_url:     coverUrl,
      gallery_urls:  allGalleryUrls,
      event_type:    document.getElementById('eeeType').value,
      format:        document.getElementById('eeeFormat').value,
      age_group:     document.getElementById('eeeAgeGroup').value,
      denomination:  document.getElementById('eeeDenomination').value.trim() || null,
      description:   document.getElementById('eeeDesc').value.trim(),
      start_date:    localInputToISO(document.getElementById('eeeStartDate').value),
      end_date:      localInputToISO(document.getElementById('eeeEndDate').value),
      sales_cutoff:  localInputToISO(document.getElementById('eeeSalesCutoff').value || document.getElementById('eeeEndDate').value),
      venue_name:    document.getElementById('eeeVenue').value.trim(),
      address:       document.getElementById('eeeAddress').value.trim(),
      city:          document.getElementById('eeeCity').value.trim(),
      state:         document.getElementById('eeeState').value.trim(),
      max_capacity:  cap ? Number(cap) : null,
      online_url:    document.getElementById('eeeOnlineUrl').value.trim() || null,
      forum_enabled: document.getElementById('eeeForumEnabled').checked,
    };

    const res = await fetch(`${API_BASE}/api/events/${editEventId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) { errEl.textContent = data.error || 'Failed to save.'; errEl.classList.add('show'); return; }

    // Save new ticket types
    if (editEventIsPaid) {
      btn.innerHTML = '<div class="spinner spinner-gold"></div>&nbsp;Saving tickets…';
      const newRows = document.querySelectorAll('#eeeTicketList [data-tt-id="new"]');
      for (const row of newRows) {
        const ttName  = row.querySelector('[data-field="name"]')?.value.trim();
        const ttPrice = parseFloat(row.querySelector('[data-field="price"]')?.value);
        const ttQty   = row.querySelector('[data-field="qty"]')?.value;
        if (ttName && ttPrice > 0) {
          await fetch(`${API_BASE}/api/ticket-types`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
            body: JSON.stringify({ event_id: editEventId, name: ttName, price_cents: Math.round(ttPrice * 100), quantity: ttQty ? parseInt(ttQty) : null }),
          });
        }
      }
    }

    // Save any new coupon codes added in edit sheet
    await saveEeeCoupons();

    closeSheet('editEventSheet');
    showToast('Event updated!', 'success');

    // Refresh profile events list
    fetchMyEvents();

    // Always re-fetch so detail page reflects edits immediately and selectedEvent stays current
    try {
      const freshRes = await fetch(`${API_BASE}/api/events/${editEventId}`);
      if (freshRes.ok) {
        const freshEv = await freshRes.json();
        if (!freshEv.cover_url && freshEv.image_url) freshEv.cover_url = freshEv.image_url;
        selectedEvent = freshEv;
        if (document.getElementById('page-event-detail')?.classList.contains('active')) {
          viewDetail(freshEv);
        }
      }
    } catch {
      if (selectedEvent?.id === editEventId) {
        selectedEvent = { ...selectedEvent, ...body, cover_url: coverUrl };
        if (document.getElementById('page-event-detail')?.classList.contains('active')) {
          viewDetail(selectedEvent);
        }
      }
    }

  } catch(e) {
    console.error(e);
    errEl.textContent = 'Network error. Try again.';
    errEl.classList.add('show');
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Save Changes';
  }
}

const PRESET_HOBBIES = [
  'Roller Skating','Swimming','Hiking','Reading','Praying','Bible Study','Worship',
  'Volunteering','Mentorship','Fitness','Content Creation','Photography','Traveling',
  'Cooking','Music','Church Events','Fellowship','Community Outreach','Serving','Resting'
];

const HOBBY_ICONS = {
  'roller skating': `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><path d="M8 19 L8 11 Q8 8 11 8 L17 8 Q20 8 21 10 L23 15 L23 19" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><rect x="6" y="19" width="19" height="3" rx="1" stroke="#C9A84C" stroke-width="1.5"/><circle cx="11" cy="25.5" r="3" stroke="#C9A84C" stroke-width="2"/><circle cx="21" cy="25.5" r="3" stroke="#C9A84C" stroke-width="2"/></svg>`,
  'swimming':        `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><path d="M4 20 C7 17 9 23 12 20 C15 17 17 23 20 20 C23 17 25 23 28 20" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M4 25 C7 22 9 28 12 25 C15 22 17 28 20 25 C23 22 25 28 28 25" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><circle cx="22" cy="10" r="3" stroke="#C9A84C" stroke-width="2"/><path d="M10 15 L16 10 L22 13" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  'hiking':          `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><path d="M6 28 L12 16 L16 20 L22 10 L28 28" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="22" cy="7" r="3" stroke="#C9A84C" stroke-width="1.5"/><path d="M8 28 L8 22" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  'reading':         `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><path d="M6 6 C6 6 10 5 16 8 C22 5 26 6 26 6 L26 26 C26 26 22 25 16 28 C10 25 6 26 6 26 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><line x1="16" y1="8" x2="16" y2="28" stroke="#C9A84C" stroke-width="1.5"/></svg>`,
  'praying':         `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><path d="M10 22 L7 12 C6.5 10 7.5 8 9 8 C10 8 11 8.5 11.5 9.5 L14 16" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 22 L25 12 C25.5 10 24.5 8 23 8 C22 8 21 8.5 20.5 9.5 L18 16" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 22 C10 25 12.5 27 16 27 C19.5 27 22 25 22 22 L22 16 C22 14.5 21 13.5 19.5 13.5 L18 16 L16 18 L14 16 L12.5 13.5 C11 13.5 10 14.5 10 16 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/></svg>`,
  'bible study':     `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><rect x="5" y="5" width="22" height="26" rx="2" stroke="#C9A84C" stroke-width="2"/><path d="M5 10 L27 10" stroke="#C9A84C" stroke-width="1.5"/><rect x="14" y="3" width="4" height="28" rx="1" fill="#C9A84C" opacity="0.18"/><line x1="9" y1="16" x2="23" y2="16" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="9" y1="21" x2="19" y2="21" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  'worship':         `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><rect x="12" y="4" width="8" height="14" rx="4" stroke="#C9A84C" stroke-width="2"/><path d="M8 16 C8 22 24 22 24 16" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="22" x2="16" y2="28" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="11" y1="28" x2="21" y2="28" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  'volunteering':    `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><path d="M16 7 C14 4 9 4 9 9 C9 13 13 16 16 19 C19 16 23 13 23 9 C23 4 18 4 16 7Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><path d="M10 22 L8 28 L16 25 L24 28 L22 22" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  'mentorship':      `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><circle cx="11" cy="10" r="4" stroke="#C9A84C" stroke-width="2"/><circle cx="22" cy="8" r="3" stroke="#C9A84C" stroke-width="1.5"/><path d="M4 26 C4 21 7 19 11 19 C15 19 18 21 18 26" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M20 17 C22 16 28 17 28 22" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  'fitness':         `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><rect x="3" y="14" width="4" height="4" rx="1" stroke="#C9A84C" stroke-width="1.5"/><rect x="25" y="14" width="4" height="4" rx="1" stroke="#C9A84C" stroke-width="1.5"/><rect x="7" y="11" width="4" height="10" rx="1" stroke="#C9A84C" stroke-width="1.5"/><rect x="21" y="11" width="4" height="10" rx="1" stroke="#C9A84C" stroke-width="1.5"/><line x1="11" y1="16" x2="21" y2="16" stroke="#C9A84C" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  'content creation':`<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><rect x="4" y="7" width="24" height="16" rx="2" stroke="#C9A84C" stroke-width="2"/><circle cx="16" cy="15" r="4" stroke="#C9A84C" stroke-width="1.5"/><path d="M10 27 L22 27" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M16 23 L16 27" stroke="#C9A84C" stroke-width="1.5"/></svg>`,
  'photography':     `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><rect x="3" y="9" width="26" height="18" rx="2" stroke="#C9A84C" stroke-width="2"/><circle cx="16" cy="18" r="5" stroke="#C9A84C" stroke-width="2"/><path d="M11 9 L13 5 L19 5 L21 9" stroke="#C9A84C" stroke-width="1.5" stroke-linejoin="round"/><circle cx="24" cy="13" r="1.5" fill="#C9A84C"/></svg>`,
  'traveling':       `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><path d="M16 4 C10 4 5 9 5 15 C5 22 16 30 16 30 C16 30 27 22 27 15 C27 9 22 4 16 4Z" stroke="#C9A84C" stroke-width="2"/><circle cx="16" cy="15" r="4" stroke="#C9A84C" stroke-width="1.5"/></svg>`,
  'cooking':         `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><path d="M8 14 C8 10 12 7 16 7 C20 7 24 10 24 14 L24 18 L8 18 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><line x1="6" y1="18" x2="26" y2="18" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M13 18 L13 24 L19 24 L19 18" stroke="#C9A84C" stroke-width="1.5"/><line x1="10" y1="24" x2="22" y2="24" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
  'music':           `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><path d="M12 24 L12 8 L27 5 L27 21" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="25" r="3" stroke="#C9A84C" stroke-width="2"/><circle cx="24" cy="22" r="3" stroke="#C9A84C" stroke-width="2"/></svg>`,
  'church events':   `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><rect x="7" y="13" width="18" height="16" rx="1" stroke="#C9A84C" stroke-width="2"/><path d="M4 15 L16 5 L28 15" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><rect x="14" y="4" width="4" height="6" rx="1" fill="#C9A84C"/><rect x="13" y="1" width="6" height="3" rx="0.5" fill="#C9A84C"/><rect x="13" y="20" width="6" height="9" rx="1" stroke="#C9A84C" stroke-width="1.5"/></svg>`,
  'fellowship':      `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><circle cx="10" cy="10" r="4" stroke="#C9A84C" stroke-width="2"/><circle cx="22" cy="10" r="4" stroke="#C9A84C" stroke-width="2"/><circle cx="16" cy="22" r="4" stroke="#C9A84C" stroke-width="2"/><line x1="14" y1="10" x2="18" y2="10" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="14" x2="14" y2="18" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><line x1="20" y1="14" x2="18" y2="18" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  'community outreach':`<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="9" r="4" stroke="#C9A84C" stroke-width="2"/><path d="M8 28 C8 22 11 19 16 19 C21 19 24 22 24 28" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M24 12 L28 10 M24 14 L28 16" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  'serving':         `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><path d="M6 18 L26 18" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M10 18 C10 13 13 10 16 10 C19 10 22 13 22 18" stroke="#C9A84C" stroke-width="2"/><line x1="16" y1="6" x2="16" y2="10" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><path d="M9 22 L9 25 C9 26 10 27 11 27 L21 27 C22 27 23 26 23 25 L23 22" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  'resting':         `<svg width="13" height="13" viewBox="0 0 32 32" fill="none"><rect x="3" y="18" width="26" height="8" rx="2" stroke="#C9A84C" stroke-width="2"/><path d="M3 22 L3 15 C3 13.5 4 13 5 13 L16 13 L16 22" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><path d="M16 13 L16 18 C16 18 19 18 22 18 C24 18 26 16.5 26 14.5 C26 12.5 24.5 11 22 11 L18 11 C17 11 16 11.5 16 13 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><line x1="3" y1="26" x2="3" y2="29" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="29" y1="26" x2="29" y2="29" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>`,
};

function hobbyIcon(name) {
  return HOBBY_ICONS[name.toLowerCase()] || '';
}

function renderProfilePage() {
  if (!currentUser) return;
  const name = profileData?.full_name || currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Friend';

  // ── Avatar ────────────────────────────────────────────────
  const avEl = document.getElementById('profAv');
  avEl.innerHTML = '';
  if (profileData?.avatar_url) {
    const img = document.createElement('img');
    img.src = profileData.avatar_url;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%';
    avEl.appendChild(img);
    avEl.style.background = 'transparent';
  } else {
    avEl.textContent = name.charAt(0).toUpperCase();
    avEl.style.background = profileData?.avatar_color || 'linear-gradient(135deg,var(--gold),#6B4A00)';
  }
  // ── Avatar ring ───────────────────────────────────────────
  const ringColor = profileData?.avatar_ring_color;
  avEl.style.outline = ringColor ? `3px solid ${ringColor}` : 'none';
  avEl.style.outlineOffset = ringColor ? '3px' : '0';

  // ── Banner ────────────────────────────────────────────────
  const bannerImg = document.getElementById('profBannerImg');
  if (bannerImg) {
    if (profileData?.banner_url) {
      bannerImg.src = profileData.banner_url;
      bannerImg.style.display = 'block';
    } else {
      bannerImg.style.display = 'none';
    }
  }

  // ── Identity ──────────────────────────────────────────────
  document.getElementById('profName').textContent = name;
  document.getElementById('profHandle').textContent = currentUser.email || '';

  // Verified badge — role-based OR identity-verified
  const verifiedBadge = document.getElementById('profVerifiedBadge');
  const isVerified = profileData?.role === 'verified' || profileData?.role === 'admin' || profileData?.identity_verified;
  if (verifiedBadge) verifiedBadge.style.display = isVerified ? 'inline-flex' : 'none';

  // Joined chip
  const joinedEl = document.getElementById('profJoined');
  const joinedTextEl = document.getElementById('profJoinedText');
  if (currentUser.created_at && joinedEl && joinedTextEl) {
    joinedTextEl.textContent = 'Joined ' + new Date(currentUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    joinedEl.style.display = 'inline-flex';
  }

  // City chip
  const city = profileData?.city || '';
  const cityChip = document.getElementById('profCityChip');
  const cityText = document.getElementById('profCityText');
  if (city && cityChip && cityText) {
    cityText.textContent = city;
    cityChip.style.display = 'inline-flex';
  } else if (cityChip) {
    cityChip.style.display = 'none';
  }

  // Role chip
  const roleLabels = { admin: 'Admin', verified: 'Verified Host', host: 'Host' };
  const roleChip = document.getElementById('profRoleChip');
  const roleText = document.getElementById('profRoleText');
  if (roleLabels[profileData?.role] && roleChip && roleText) {
    roleText.textContent = roleLabels[profileData.role];
    const roleClass = profileData.role === 'admin' ? 'role-admin' : 'role-verified';
    roleChip.className = `prof-meta-chip ${roleClass}`;
    roleChip.style.display = 'inline-flex';
  } else if (roleChip) {
    roleChip.style.display = 'none';
  }

  // Bio
  const bioEl = document.getElementById('profBio');
  if (profileData?.bio) {
    bioEl.textContent = profileData.bio;
    bioEl.style.display = 'block';
  } else {
    bioEl.style.display = 'none';
  }

  renderSocialLinks('profSocialLinks', profileData);

  // ── Stats (followers/following are placeholders for now) ──
  const statFollowersEl = document.getElementById('statFollowers');
  const statFollowingEl = document.getElementById('statFollowing');
  if (statFollowersEl) statFollowersEl.textContent = profileData?.followers_count ?? 0;
  if (statFollowingEl) statFollowingEl.textContent = profileData?.following_count ?? 0;
  // statEvents is updated by fetchMyEvents()

  // ── Bible Verse ───────────────────────────────────────────
  const verseSection = document.getElementById('profVerseSection');
  const verseText    = document.getElementById('profVerseText');
  const verseRef     = document.getElementById('profVerseRef');
  const verseVer     = document.getElementById('profVerseVersion');
  if (profileData?.bible_verse) {
    verseText.textContent = `"${profileData.bible_verse}"`;
    verseRef.textContent  = profileData.bible_verse_reference || '';
    verseVer.textContent  = profileData.bible_version ? `• ${profileData.bible_version}` : '';
    verseRef.style.display  = profileData.bible_verse_reference ? 'inline' : 'none';
    verseVer.style.display  = profileData.bible_version ? 'inline' : 'none';
    verseSection.style.display = 'block';
  } else {
    verseSection.style.display = 'none';
  }

  // ── Faith Thought (hot takes) + Interests (hobbies) — two col ─
  const hotSection     = document.getElementById('profHotSection');
  const hotText        = document.getElementById('profHotText');
  const hobbiesSection = document.getElementById('profHobbiesSection');
  const hobbiesChips   = document.getElementById('profHobbiesChips');
  const twoColRow      = document.getElementById('profTwoColRow');

  const hasHot     = !!profileData?.hot_takes;
  const hasHobbies = !!profileData?.hobbies;

  if (hasHot) hotText.textContent = profileData.hot_takes;
  if (hasHobbies && hobbiesChips) {
    // Split stored hobbies string and match against preset list for chip display
    const stored = profileData.hobbies.split(',').map(h => h.trim()).filter(Boolean);
    const matched = stored.filter(h => PRESET_HOBBIES.some(p => p.toLowerCase() === h.toLowerCase()));
    const display = matched.length ? matched : stored.slice(0, 6);
    hobbiesChips.innerHTML = display
      .map(h => `<span class="prof-hobby-chip">${hobbyIcon(h)}${h}</span>`)
      .join('');
  }

  if (twoColRow) {
    if (hasHot || hasHobbies) {
      twoColRow.style.display = 'flex';
      hotSection.style.display     = hasHot ? '' : 'none';
      hobbiesSection.style.display = hasHobbies ? '' : 'none';
    } else {
      twoColRow.style.display = 'none';
    }
  }

  // ── Connect Tags ──────────────────────────────────────────
  const connectSection = document.getElementById('profConnectSection');
  const connectGrid    = document.getElementById('profConnectGrid');
  const tags = profileData?.connect_tags || [];
  if (tags.length) {
    const tagMap = Object.fromEntries(CONNECT_TAGS.map(t => [t.id, t]));
    connectGrid.innerHTML = tags
      .filter(id => tagMap[id])
      .map(id => `<div class="prof-connect-pill"><span style="display:flex">${icon(tagMap[id].iconName, 16)}</span>${tagMap[id].label}</div>`)
      .join('');
    connectSection.style.display = 'block';
  } else {
    connectSection.style.display = 'none';
  }

  // ── Prayer Request ────────────────────────────────────────
  const prayerSection = document.getElementById('profPrayerSection');
  const prayerText    = document.getElementById('profPrayerText');
  if (profileData?.prayer_request) {
    prayerText.textContent = profileData.prayer_request;
    prayerSection.style.display = 'block';
  } else {
    prayerSection.style.display = 'none';
  }

  // ── Latest Testimony ──────────────────────────────────────
  const testimonySection = document.getElementById('profTestimonySection');
  const testimonyText    = document.getElementById('profTestimonyText');
  if (profileData?.testimony) {
    testimonyText.textContent = profileData.testimony;
    testimonySection.style.display = 'block';
  } else {
    testimonySection.style.display = 'none';
  }

  // ── About (bio fallback) ──────────────────────────────────
  const hasNewFields = profileData?.bible_verse || profileData?.hot_takes || profileData?.hobbies || tags.length;
  const aboutSection = document.getElementById('profAboutSection');
  const aboutEl      = document.getElementById('profAbout');
  if (!hasNewFields && profileData?.bio) {
    aboutEl.textContent = profileData.bio;
    aboutSection.style.display = 'block';
  } else {
    aboutSection.style.display = 'none';
  }

  // ── Profile completion nudge ──────────────────────────────
  const nudge = document.getElementById('profNudge');
  if (nudge) nudge.style.display = hasNewFields ? 'none' : 'block';

  // ── Auth gate logo ────────────────────────────────────────
  const gateLogo = document.getElementById('profGateLogo');
  if (gateLogo && !gateLogo.innerHTML) {
    gateLogo.style.cssText = 'width:72px;height:72px;border-radius:50%;overflow:hidden;margin:0 auto';
    gateLogo.innerHTML = LOGO_MARK;
  }

  // ── Stripe Connect + Identity gate (only after ≥4 profile sections filled) ──
  const _profileSectionsFilled = [
    profileData?.full_name,
    profileData?.bio,
    profileData?.bible_verse,
    profileData?.hot_takes,
    profileData?.hobbies,
    (profileData?.connect_tags || []).length > 0,
    profileData?.prayer_request,
    profileData?.testimony,
    profileData?.city,
  ].filter(Boolean).length;
  const _profileReady = _profileSectionsFilled >= 4;
  const _stripeSection = document.getElementById('stripeConnectSection');
  if (_stripeSection) _stripeSection.dataset.profileReady = _profileReady ? '1' : '0';
  renderIdentityGate(_profileReady);
  renderStripeConnectStatus();
  syncAdminNav();
}

function renderHostedEventsPreview(events) {
  const section  = document.getElementById('profHostedEventsSection');
  const container = document.getElementById('profHostedEventsPreview');
  if (!section || !container) return;
  const published = (events || []).filter(e => e.status === 'published').slice(0, 3);
  if (!published.length) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  container.innerHTML = published.map(ev => {
    const d = ev.start_date ? new Date(ev.start_date).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}) : 'Date TBD';
    const thumb = ev.cover_url
      ? `<img alt="" src="${ev.cover_url}" style="width:100%;height:100%;object-fit:cover">`
      : `<svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect x="14" y="4" width="4" height="24" rx="1.5" fill="#C9A84C"/><rect x="6" y="11" width="20" height="4" rx="1.5" fill="#C9A84C"/></svg>`;
    const city = ev.city ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>${escapeHtml(ev.city)}` : '';
    return `<div class="prof-event-preview" onclick="viewDetail(${JSON.stringify(ev).replace(/"/g,'&quot;')})">
      <div class="prof-event-thumb">${thumb}</div>
      <div class="prof-event-info">
        <div class="prof-event-name">${escapeHtml(ev.name || 'Untitled Event')}</div>
        <div class="prof-event-meta">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${d}${city ? ' · ' + city : ''}
        </div>
        ${ev.attendee_count ? `<div class="prof-event-attendees">${ev.attendee_count} attending</div>` : ''}
      </div>
      <div class="prof-event-view-btn">View</div>
    </div>`;
  }).join('');
}

function shareProfile() {
  if (!currentUser) return;
  const name = profileData?.full_name || currentUser.email?.split('@')[0] || 'my profile';
  const url  = `${window.location.origin}${window.location.pathname}#user/${currentUser.id}`;
  if (navigator.share) {
    navigator.share({ title: `${name} on ChristLink`, url }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(url).then(() => showToast('Link copied!')).catch(() => showToast('Link copied!'));
  }
}

function renderStripeConnectStatus() {
  const section = document.getElementById('stripeConnectSection');
  if (!section) return;
  if (section.dataset.profileReady === '0') { section.style.display = 'none'; return; }
  if (!profileData?.identity_verified)       { section.style.display = 'none'; return; }
  section.style.display = 'block';

  const stripe = profileData?.host_stripe_accounts?.[0];
  const dot    = document.getElementById('stripeStatusDot');
  const label  = document.getElementById('stripeStatusLabel');
  const sub    = document.getElementById('stripeStatusSub');
  const btn    = document.getElementById('stripeConnectBtn');
  if (!dot || !label || !sub || !btn) return;

  if (!stripe?.stripe_account_id) {
    // Not started
    dot.style.background = '#888';
    label.textContent    = 'Not connected';
    sub.textContent      = 'Connect Stripe to receive payouts from paid events';
    btn.textContent      = 'Set Up Payouts →';
    btn.onclick          = startStripeConnect;
    btn.style.display    = 'block';

  } else if (!stripe.payouts_enabled && !stripe.onboarding_complete) {
    // Started but not finished
    dot.style.background = '#C9A84C';
    label.textContent    = 'Setup incomplete';
    sub.textContent      = 'Continue Stripe setup to enable payouts';
    btn.textContent      = 'Continue Setup →';
    btn.onclick          = startStripeConnect;
    btn.style.display    = 'block';

  } else if (stripe.onboarding_complete && !stripe.payouts_enabled) {
    // Submitted, Stripe verifying
    dot.style.background = '#C9A84C';
    label.textContent    = 'Verification pending';
    sub.textContent      = 'Stripe is verifying your account — usually takes a few minutes';
    btn.textContent      = 'Check Status';
    btn.onclick          = async () => {
      btn.textContent = 'Checking…';
      btn.disabled    = true;
      try {
        const res = await fetch(`${API_BASE}/api/connect-sync`, {
          method:  'POST',
          headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
        });
        if (res.ok) { await fetchProfile(); renderStripeConnectStatus(); showToast('Status refreshed'); }
      } catch {}
      btn.disabled = false;
    };
    btn.style.display = 'block';

  } else {
    // Fully active
    dot.style.background = '#4EC98C';
    label.textContent    = 'Payouts active';
    sub.textContent      = 'Your Stripe account is connected and receiving payments';
    btn.textContent      = 'Manage in Stripe ↗';
    btn.onclick          = startStripeConnect;
    btn.style.display    = 'block';
  }

  // Show disconnect button whenever an account record exists
  const disconnectBtn = document.getElementById('stripeDisconnectBtn');
  if (disconnectBtn) disconnectBtn.style.display = stripe?.stripe_account_id ? 'block' : 'none';
}

// ── Identity Verification ─────────────────────────────────

let _identityVerifData = null; // cached status from server

function renderIdentityGate(profileReady) {
  const gate = document.getElementById('identityVerifGate');
  if (!gate) return;
  const role = profileData?.role;
  // Only hosts and admins need identity verification for payouts
  if (role !== 'host' && role !== 'admin') { gate.style.display = 'none'; return; }
  if (!profileReady) { gate.style.display = 'none'; return; }
  if (profileData?.identity_verified) {
    // Already verified — show compact badge
    gate.style.display = 'block';
    gate.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;background:rgba(34,197,94,.07);border:1px solid rgba(34,197,94,.25);border-radius:var(--r-md);padding:12px 14px">
        <div style="width:32px;height:32px;border-radius:50%;background:rgba(34,197,94,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
        </div>
        <div>
          <div style="font-size:14px;font-weight:700;color:#22c55e">Identity Verified</div>
          <div style="font-size:12px;color:var(--muted2)">Your identity has been confirmed by ChristLink</div>
        </div>
      </div>`;
    return;
  }
  // Not verified — fetch status if not cached, then render
  gate.style.display = 'block';
  _renderIdentityGateContent(gate);
  if (!_identityVerifData) fetchIdentityStatus();
}

function _renderIdentityGateContent(gate) {
  const v = _identityVerifData;
  if (v?.status === 'pending') {
    gate.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:10px;background:rgba(245,158,11,.07);border:1px solid rgba(245,158,11,.25);border-radius:var(--r-md);padding:14px">
        <div style="width:32px;height:32px;border-radius:50%;background:rgba(245,158,11,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div>
          <div style="font-size:14px;font-weight:700;color:#f59e0b">Under Review</div>
          <div style="font-size:12px;color:var(--muted2);line-height:1.6;margin-top:2px">Your identity verification is being reviewed. This typically takes 1–2 business days. You'll be able to set up Stripe payouts once approved.</div>
        </div>
      </div>`;
  } else if (v?.status === 'rejected') {
    gate.innerHTML = `
      <div style="background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.25);border-radius:var(--r-md);padding:14px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <div style="font-size:14px;font-weight:700;color:#ef4444">Verification Not Approved</div>
        </div>
        <div style="font-size:12px;color:var(--muted2);line-height:1.6;margin-bottom:12px">${escapeHtml(v.rejected_reason || 'Your submission could not be verified. Please try again with a clear, valid ID.')}</div>
        <button class="btn btn-gold btn-sm" onclick="openIdentityVerify()" style="width:100%">Re-submit Verification →</button>
      </div>`;
  } else {
    // Not submitted yet
    gate.innerHTML = `
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-md);padding:16px">
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px">
          <div style="width:36px;height:36px;border-radius:50%;background:rgba(201,168,76,.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:4px">Verify Your Identity</div>
            <div style="font-size:12px;color:var(--muted2);line-height:1.6">Identity verification is required before setting up Stripe payouts. This one-time process protects both hosts and attendees on ChristLink.</div>
          </div>
        </div>
        <button class="btn btn-gold" onclick="openIdentityVerify()" style="width:100%">Verify Identity →</button>
      </div>`;
  }
}

async function fetchIdentityStatus() {
  try {
    const res = await fetch(`${API_BASE}/api/identity/status`, {
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    const data = await res.json();
    _identityVerifData = data.verification;
    const gate = document.getElementById('identityVerifGate');
    if (gate && gate.style.display !== 'none') _renderIdentityGateContent(gate);
  } catch {}
}

function openIdentityVerify() {
  const name = profileData?.full_name || '';
  document.getElementById('ivLegalName').value = name;
  document.getElementById('ivNameMismatch').style.display = 'none';
  document.getElementById('ivErr').textContent = '';
  ivClearDoc();
  openSheet('identityVerifySheet');
}

function ivPreviewDoc(input) {
  const file = input.files?.[0];
  if (!file) return;
  const preview  = document.getElementById('ivDocPreview');
  const img      = document.getElementById('ivDocImg');
  const pdfLabel = document.getElementById('ivDocPdfLabel');
  const pdfName  = document.getElementById('ivDocPdfName');
  preview.style.display = 'block';
  document.getElementById('ivUploadLabel').style.borderColor = 'var(--gold)';
  if (file.type === 'application/pdf') {
    img.style.display      = 'none';
    pdfLabel.style.display = 'block';
    pdfName.textContent    = file.name;
  } else {
    const reader = new FileReader();
    reader.onload = e => { img.src = e.target.result; img.style.display = 'block'; pdfLabel.style.display = 'none'; };
    reader.readAsDataURL(file);
  }
}

function ivClearDoc() {
  const input = document.getElementById('ivDocInput');
  if (input) input.value = '';
  const preview = document.getElementById('ivDocPreview');
  if (preview) preview.style.display = 'none';
  const lbl = document.getElementById('ivUploadLabel');
  if (lbl) lbl.style.borderColor = 'rgba(201,168,76,.3)';
}

document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('ivLegalName');
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      const entered  = nameInput.value.trim().toLowerCase();
      const profName = (profileData?.full_name || '').trim().toLowerCase();
      const mismatch = document.getElementById('ivNameMismatch');
      if (mismatch) mismatch.style.display = entered && profName && entered !== profName ? 'block' : 'none';
    });
  }
});

async function submitIdentityVerification() {
  const legalName = document.getElementById('ivLegalName').value.trim();
  const fileInput = document.getElementById('ivDocInput');
  const errEl     = document.getElementById('ivErr');
  const btn       = document.getElementById('ivSubmitBtn');
  errEl.textContent = '';

  if (!legalName) { errEl.textContent = 'Please enter your legal name as it appears on your ID.'; return; }
  if (!fileInput?.files?.length) { errEl.textContent = 'Please upload a photo of your government-issued ID.'; return; }

  const file = fileInput.files[0];
  if (file.size > 10 * 1024 * 1024) { errEl.textContent = 'File must be under 10 MB.'; return; }

  btn.disabled = true; btn.textContent = 'Uploading…';

  try {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    btn.textContent = 'Submitting…';
    const res = await fetch(`${API_BASE}/api/identity/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
      body: JSON.stringify({ legal_name: legalName, id_doc_base64: dataUrl }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Submission failed.');

    _identityVerifData = { status: 'pending', legal_name: legalName, submitted_at: new Date().toISOString() };
    closeSheet('identityVerifySheet');
    showToast('Submitted! We will review your identity within 1–2 business days.', 'success');
    await fetchProfile();
    renderIdentityGate(true);
  } catch (e) {
    errEl.textContent = e.message;
    btn.disabled = false; btn.textContent = 'Submit for Verification →';
  }
}

// Admin: identity verifications
async function loadAdminVerifications(statusFilter = 'pending') {
  const list = document.getElementById('adminVerifList');
  if (!list) return;
  // Update active filter button
  document.getElementById('verifFilterPending')?.classList[statusFilter === 'pending' ? 'add' : 'remove']('promote');
  document.getElementById('verifFilterAll')?.classList[statusFilter === '' ? 'add' : 'remove']('promote');
  list.innerHTML = '<div style="text-align:center;padding:30px;color:var(--muted2);font-size:14px"><div class="spinner spinner-gold" style="margin:0 auto 10px"></div>Loading…</div>';
  try {
    const params = statusFilter ? `?status=${statusFilter}` : '';
    const res  = await fetch(`${API_BASE}/api/admin/verifications${params}`, { headers: adminHeaders() });
    const data = await res.json();
    const items = data.verifications || [];
    if (!items.length) {
      list.innerHTML = `<div style="text-align:center;padding:30px;color:var(--muted2);font-size:14px">${statusFilter === 'pending' ? 'No pending verifications.' : 'No verifications found.'}</div>`;
      return;
    }
    list.innerHTML = items.map(v => {
      const p = v.profiles;
      const av = p?.avatar_url
        ? `<img alt="" src="${p.avatar_url}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0">`
        : `<div style="width:36px;height:36px;border-radius:50%;background:${p?.avatar_color||'#333'};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0">${(p?.full_name||'?')[0].toUpperCase()}</div>`;
      const statusColor = { pending:'#f59e0b', verified:'#22c55e', rejected:'#ef4444' }[v.status] || '#888';
      const statusLabel = { pending:'Under Review', verified:'Verified', rejected:'Rejected' }[v.status] || v.status;
      return `
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-md);padding:14px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            ${av}
            <div style="flex:1;min-width:0">
              <div style="font-size:14px;font-weight:600;color:var(--text)">${escapeHtml(p?.full_name||'—')}</div>
              <div style="font-size:11px;color:var(--muted2)">${escapeHtml(p?.email||'')}</div>
            </div>
            <span style="font-size:11px;font-weight:700;color:${statusColor};background:${statusColor}18;border:1px solid ${statusColor}44;padding:3px 8px;border-radius:20px">${statusLabel}</span>
          </div>
          <div style="font-size:12px;color:var(--muted2);margin-bottom:10px;display:flex;gap:16px;flex-wrap:wrap">
            <span><strong style="color:var(--text)">Legal name:</strong> ${escapeHtml(v.legal_name)}</span>
            <span><strong style="color:var(--text)">Submitted:</strong> ${new Date(v.submitted_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
          </div>
          ${v.rejected_reason ? `<div style="font-size:12px;color:#ef4444;margin-bottom:10px"><strong>Rejection reason:</strong> ${escapeHtml(v.rejected_reason)}</div>` : ''}
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="admin-action-btn" onclick="adminViewIdDoc('${v.user_id}',this)" style="font-size:12px">View ID</button>
            ${v.status !== 'verified'  ? `<button class="admin-action-btn promote" onclick="adminApproveVerif('${v.user_id}',this)">✓ Approve</button>` : ''}
            ${v.status !== 'rejected' ? `<button class="admin-action-btn demote"  onclick="adminRejectVerif('${v.user_id}',this)">✗ Reject</button>` : ''}
          </div>
        </div>`;
    }).join('');
  } catch (e) {
    list.innerHTML = `<div style="color:var(--red);font-size:13px;padding:16px 0">Error: ${escapeHtml(e.message)}</div>`;
  }
}

async function adminViewIdDoc(userId, btn) {
  btn.disabled = true; btn.textContent = 'Loading…';
  try {
    const res = await fetch(`${API_BASE}/api/admin/verifications/${userId}/id-doc`, { headers: adminHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    window.open(data.url, '_blank');
  } catch (e) { showToast(e.message, 'error'); }
  btn.disabled = false; btn.textContent = 'View ID';
}

async function adminApproveVerif(userId, btn) {
  if (!confirm('Approve this identity verification?')) return;
  btn.disabled = true; btn.textContent = '…';
  try {
    const res = await fetch(`${API_BASE}/api/admin/verifications/${userId}/approve`, {
      method: 'PATCH', headers: adminHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    showToast('Verification approved.', 'success');
    loadAdminVerifications(document.getElementById('verifFilterPending')?.classList.contains('promote') ? 'pending' : '');
  } catch (e) { showToast(e.message, 'error'); btn.disabled = false; btn.textContent = '✓ Approve'; }
}

async function adminRejectVerif(userId, btn) {
  const reason = prompt('Rejection reason (shown to user):');
  if (reason === null) return;
  btn.disabled = true; btn.textContent = '…';
  try {
    const res = await fetch(`${API_BASE}/api/admin/verifications/${userId}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...adminHeaders() },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    showToast('Verification rejected.', 'success');
    loadAdminVerifications(document.getElementById('verifFilterPending')?.classList.contains('promote') ? 'pending' : '');
  } catch (e) { showToast(e.message, 'error'); btn.disabled = false; btn.textContent = '✗ Reject'; }
}

async function disconnectStripeConnect() {
  if (!confirm('Disconnect your Stripe account? You will need to re-onboard to accept ticket payments. This does not cancel any pending payouts.')) return;
  const btn = document.getElementById('stripeDisconnectBtn');
  btn.disabled = true; btn.textContent = 'Disconnecting…';
  try {
    const res = await fetch(`${API_BASE}/api/connect-disconnect`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to disconnect.');
    showToast('Stripe account disconnected. You can now re-onboard.', 'success');
    await fetchProfile();
    renderStripeConnectStatus();
  } catch (e) {
    showToast(e.message, 'error');
    btn.disabled = false; btn.textContent = 'Disconnect / Reset Stripe →';
  }
}

async function startStripeConnect() {
  if (!currentUser) { openAuth('signup'); return; }

  const btn = document.getElementById('stripeConnectBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px"></div>&nbsp;Opening Stripe…';
  }

  try {
    const res = await fetch(`${API_BASE}/api/connect-onboard`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${currentSession?.access_token}`,
      },
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      if (data.platformSetup) {
        // Platform-level Stripe config issue — show inline card, not just a toast
        const section = document.getElementById('stripeConnectSection');
        if (section) {
          section.querySelector('.prof-section').innerHTML = `
            <div class="prof-section-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              Payouts (Host)
            </div>
            <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:var(--r-md);padding:14px;font-size:13px;color:#ef4444;line-height:1.6">
              <div style="font-weight:700;margin-bottom:4px">Stripe Connect setup required</div>
              <div style="color:var(--muted2)">The platform owner needs to complete the Stripe Connect platform profile before payouts can be enabled. Go to <strong style="color:var(--text)">Stripe Dashboard → Connect → Get started</strong> and complete the platform application.</div>
            </div>`;
        }
        if (btn) { btn.disabled = false; }
        return;
      }
      throw new Error(data.error || 'Failed to start setup.');
    }

    window.location.href = data.url;
  } catch(e) {
    console.error('[startStripeConnect]', e.message);
    showToast(e.message || 'Could not open Stripe. Please try again.', 'error');
    if (btn) { btn.disabled = false; renderStripeConnectStatus(); }
  }
}

function renderSocialLinks(containerId, profile) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  const links = [
    { key: 'instagram_url', label: 'Instagram', icon: '<svg width="18" height="18" viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="24" height="24" rx="7" stroke="#E1306C" stroke-width="2"/><circle cx="16" cy="16" r="5" stroke="#E1306C" stroke-width="2"/><circle cx="23" cy="9" r="1.5" fill="#E1306C"/></svg>', color: '#E1306C' },
    { key: 'facebook_url',  label: 'Facebook',  icon: '<svg width="18" height="18" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="13" stroke="#1877F2" stroke-width="2"/><path d="M20 5.5 L18 5.5 C15.8 5.5 14 7.3 14 9.5 L14 13 L11 13 L11 17 L14 17 L14 27 L18 27 L18 17 L21 17 L22 13 L18 13 L18 9.5 C18 9.2 18.2 9 18.5 9 L20 9 Z" stroke="#1877F2" stroke-width="1.5" stroke-linejoin="round"/></svg>', color: '#1877F2' },
    { key: 'tiktok_url',    label: 'TikTok',    icon: '<svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M21 4 C21 4 21.5 9 27 10 L27 14 C27 14 24 14 21 12 L21 20 C21 24 18.5 27 15 27 C11.5 27 9 24.5 9 21 C9 17.5 11.5 15 15 15 C15.7 15 16.3 15.1 17 15.3 L17 19.5 C16.4 19.2 15.7 19 15 19 C13.3 19 12 20.3 12 22 C12 23.7 13.3 25 15 25 C16.7 25 18 23.7 18 22 L18 4 Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/></svg>', color: '#fff' },
  ];
  links.forEach(({ key, label, icon, color }) => {
    if (!profile?.[key]) return;
    let href = profile[key];
    if (!href.startsWith('http')) href = 'https://' + href;
    const a = document.createElement('a');
    a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.style.cssText = `display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:${color};background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:var(--r-full);padding:5px 12px;text-decoration:none`;
    a.innerHTML = `${icon} ${label}`;
    el.appendChild(a);
  });
}

// ─── PUBLIC PROFILE VIEWER ───────────────────────────────────
let _pubProfUserId = null; // track current public profile for follow toggle

async function openPublicProfile(userId) {
  if (!userId) return;
  if (userId === currentUser?.id) { goTo('profile'); return; }
  _pubProfUserId = userId;

  const loading = document.getElementById('pubProfLoading');
  const content = document.getElementById('pubProfContent');
  const errEl   = document.getElementById('pubProfErr');
  loading.style.display = 'block'; content.style.display = 'none'; errEl.style.display = 'none';
  ['pubBibleSection','pubHotTakesSection','pubHobbiesSection','pubConnectSection','pubPrayerSection','pubTestimonySection'].forEach(id => {
    const el = document.getElementById(id); if (el) el.style.display = 'none';
  });
  document.getElementById('pubProfBannerImg').style.display = 'none';
  openSheet('publicProfileSheet');

  try {
    const headers = currentSession?.access_token ? { 'Authorization': `Bearer ${currentSession.access_token}` } : {};
    const [profRes, evRes] = await Promise.all([
      fetch(`${API_BASE}/api/profile/public/${userId}`, { headers }),
      fetch(`${API_BASE}/api/events?host_id=${encodeURIComponent(userId)}&limit=20`),
    ]);
    if (!profRes.ok) throw new Error('Not found');
    const prof       = await profRes.json();
    const hostEvents = (await evRes.json()).events || [];

    // Banner
    if (prof.banner_url) {
      const bi = document.getElementById('pubProfBannerImg');
      bi.src = prof.banner_url; bi.style.display = 'block';
    }

    // Avatar
    const avEl = document.getElementById('pubProfAv');
    avEl.innerHTML = '';
    if (prof.avatar_url) {
      const img = document.createElement('img');
      img.src = prof.avatar_url;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover';
      avEl.appendChild(img);
      avEl.style.background = 'transparent';
    } else {
      avEl.textContent = (prof.full_name || '?').charAt(0).toUpperCase();
      avEl.style.background = prof.avatar_color || 'var(--gold)';
    }
    const pubRing = prof.avatar_ring_color;
    avEl.style.outline = pubRing ? `3px solid ${pubRing}` : 'none';
    avEl.style.outlineOffset = pubRing ? '3px' : '0';

    // Name + role
    document.getElementById('pubProfName').textContent = prof.full_name || 'ChristLink Member';
    document.getElementById('pubProfCity').textContent = prof.city || '';
    const roleLabels = { admin:'Admin', verified:'Verified Host', host:'Event Host' };
    const roleChip = document.getElementById('pubProfRoleChip');
    if (roleChip) {
      const label = roleLabels[prof.role];
      if (label) { roleChip.textContent = label; roleChip.style.display = 'inline-flex'; }
      else roleChip.style.display = 'none';
    }
    // Verified badge
    const verBadge = document.getElementById('pubProfVerifiedBadge');
    if (verBadge) verBadge.style.display = (prof.role === 'admin' || prof.role === 'verified') ? 'inline-flex' : 'none';

    // Stats
    const sF = document.getElementById('pubStatFollowers');
    const sG = document.getElementById('pubStatFollowing');
    const sE = document.getElementById('pubStatEvents');
    if (sF) sF.textContent = prof.followers_count ?? 0;
    if (sG) sG.textContent = prof.following_count ?? 0;
    if (sE) sE.textContent = hostEvents.filter(e => e.status === 'published').length;

    // Follow button — only show when logged in
    const actionRow = document.getElementById('pubProfActionRow');
    const followBtn = document.getElementById('pubFollowBtn');
    if (actionRow && followBtn && currentUser && !prof.restricted) {
      actionRow.style.display = 'block';
      _updateFollowBtn(prof.is_following);
    } else if (actionRow) {
      actionRow.style.display = 'none';
    }

    document.getElementById('pubProfBio').textContent = prof.bio || '';
    renderSocialLinks('pubProfSocial', prof);

    if (!prof.restricted) {
      // Bible verse
      if (prof.bible_verse) {
        document.getElementById('pubBibleVerse').textContent = `"${prof.bible_verse}"`;
        const refParts = [prof.bible_verse_reference, prof.bible_version ? `• ${prof.bible_version}` : null].filter(Boolean);
        document.getElementById('pubBibleRef').textContent = refParts.join(' ');
        document.getElementById('pubBibleSection').style.display = 'block';
      }
      // Faith Thought
      if (prof.hot_takes) {
        document.getElementById('pubHotTakes').textContent = prof.hot_takes;
        document.getElementById('pubHotTakesSection').style.display = 'block';
      }
      // Hobbies as chips
      if (prof.hobbies) {
        const hobbiesEl = document.getElementById('pubHobbies');
        const chips = prof.hobbies.split(',').map(h => h.trim()).filter(Boolean);
        hobbiesEl.innerHTML = chips.map(h => `<span class="prof-hobby-chip">${hobbyIcon(h)}${h}</span>`).join('');
        document.getElementById('pubHobbiesSection').style.display = 'block';
      }
      // Connect tags
      const tags = prof.connect_tags || [];
      if (tags.length) {
        const tagMap = Object.fromEntries(CONNECT_TAGS.map(t => [t.id, t]));
        document.getElementById('pubConnectTags').innerHTML = tags
          .filter(id => tagMap[id])
          .map(id => `<div class="connect-tag-pill"><span class="tag-icon" style="display:flex">${icon(tagMap[id].iconName, 16)}</span><span>${tagMap[id].label}</span></div>`)
          .join('');
        document.getElementById('pubConnectSection').style.display = 'block';
      }
      // Prayer Request
      if (prof.prayer_request) {
        document.getElementById('pubPrayerText').textContent = prof.prayer_request;
        const supporters = Array.isArray(prof.prayer_supporters) ? prof.prayer_supporters : [];
        document.getElementById('pubPrayerCount').textContent = supporters.length;
        const prayBtn = document.getElementById('pubPrayingBtn');
        if (prayBtn && currentUser) {
          prayBtn.style.display = 'inline-flex';
          const isSupporting = supporters.includes(currentUser.id);
          prayBtn.innerHTML = `🙏 Praying for you · <span id="pubPrayerCount">${supporters.length}</span>`;
          prayBtn.style.borderColor = isSupporting ? 'var(--gold)' : '';
        }
        document.getElementById('pubPrayerSection').style.display = 'block';
      }
      // Latest Testimony
      if (prof.testimony) {
        document.getElementById('pubTestimonyText').textContent = prof.testimony;
        document.getElementById('pubTestimonySection').style.display = 'block';
      }
    }

    // Hosted events list
    const listEl = document.getElementById('pubProfEventsList');
    listEl.innerHTML = '';
    if (hostEvents.length === 0) {
      listEl.innerHTML = '<div style="font-size:13px;color:var(--muted2)">No public events yet.</div>';
    } else {
      hostEvents.forEach(ev => {
        const d = document.createElement('div');
        d.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer';
        d.innerHTML = `<div><div style="font-size:14px;font-weight:600">${escapeHtml(ev.name)}</div><div style="font-size:12px;color:var(--muted2)">${escapeHtml(ev.city||'')} · ${ev.start_date ? new Date(ev.start_date).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : 'Date TBD'}</div></div><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;
        d.onclick = () => { closeSheet('publicProfileSheet'); viewDetail(ev); goTo('event-detail'); };
        listEl.appendChild(d);
      });
    }
    document.getElementById('pubProfEvents').style.display =
      (hostEvents.length === 0 && !['host','admin','verified'].includes(prof.role)) ? 'none' : 'block';

    loading.style.display = 'none'; content.style.display = 'block';
  } catch {
    loading.style.display = 'none'; errEl.style.display = 'block';
  }
}

function _updateFollowBtn(isFollowing) {
  const btn = document.getElementById('pubFollowBtn');
  if (!btn) return;
  if (isFollowing) {
    btn.textContent = 'Following';
    btn.style.cssText = 'width:100%;height:40px;font-size:14px;font-weight:700;border-radius:var(--r-full);background:var(--surface2);border:1.5px solid var(--border2);color:var(--text);cursor:pointer';
  } else {
    btn.textContent = 'Follow';
    btn.style.cssText = 'width:100%;height:40px;font-size:14px;font-weight:700;border-radius:var(--r-full);background:var(--gold);border:none;color:#000;cursor:pointer';
  }
  btn.dataset.following = isFollowing ? '1' : '0';
}

async function togglePrayerSupport() {
  if (!currentUser) { openSheet('authSheet'); return; }
  const targetId = _pubProfUserId;
  if (!targetId || targetId === currentUser.id) return;
  try {
    const res = await fetch(`${API_BASE}/api/profile/prayer-support`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${currentSession?.access_token}` },
      body: JSON.stringify({ target_user_id: targetId }),
    });
    const d = await res.json();
    if (!res.ok) throw new Error(d.error || 'failed');
    const countEl = document.getElementById('pubPrayerCount');
    if (countEl) countEl.textContent = d.prayer_supporters.length;
    const btn = document.getElementById('pubPrayingBtn');
    if (btn) btn.style.borderColor = d.supporting ? 'var(--gold)' : '';
    showToast(d.supporting ? 'Praying for them! 🙏' : 'Prayer support removed', 'success');
  } catch {
    showToast('Could not update. Try again.', 'error');
  }
}

async function toggleFollow() {
  if (!currentUser) { openAuth('signup'); return; }
  if (!_pubProfUserId) return;
  const btn = document.getElementById('pubFollowBtn');
  const isFollowing = btn?.dataset.following === '1';
  btn.disabled = true;
  try {
    const method  = isFollowing ? 'DELETE' : 'POST';
    const res = await fetch(`${API_BASE}/api/follow/${_pubProfUserId}`, {
      method,
      headers: { 'Authorization': `Bearer ${currentSession.access_token}` },
    });
    if (!res.ok) throw new Error('failed');
    const nowFollowing = !isFollowing;
    _updateFollowBtn(nowFollowing);
    // Update viewed profile's follower count
    const sF = document.getElementById('pubStatFollowers');
    if (sF) sF.textContent = Math.max(0, parseInt(sF.textContent || '0') + (nowFollowing ? 1 : -1));
    // Update own profile's following count immediately
    if (profileData) {
      profileData.following_count = Math.max(0, (profileData.following_count ?? 0) + (nowFollowing ? 1 : -1));
      const ownFollowing = document.getElementById('statFollowing');
      if (ownFollowing) ownFollowing.textContent = profileData.following_count;
    }
  } catch {
    showToast('Could not update follow. Try again.', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ── PROFILE LIST SHEET (followers / following / events) ─────────
let _profileListEventsMap = {};

function openPersonalProfileList(type) {
  const uid = currentUser?.id;
  if (!uid) { openAuth('signup'); return; }
  openProfileList(type, uid);
}

async function openProfileList(type, userId) {
  if (!userId) return;
  const titleEl   = document.getElementById('profileListTitle');
  const loadingEl = document.getElementById('profileListLoading');
  const contentEl = document.getElementById('profileListContent');
  const titles    = { followers: 'Followers', following: 'Following', events: 'Events' };
  titleEl.textContent     = titles[type] || type;
  loadingEl.style.display = 'block';
  loadingEl.textContent   = 'Loading…';
  contentEl.style.display = 'none';
  contentEl.innerHTML     = '';
  _profileListEventsMap   = {};
  openSheet('profileListSheet');
  try {
    if (type === 'followers' || type === 'following') {
      const res   = await fetch(`${API_BASE}/api/${type}/${userId}`);
      const data  = await res.json();
      const users = data.users || [];
      if (users.length === 0) {
        contentEl.innerHTML = `<div style="text-align:center;padding:48px 20px;color:var(--muted)">No ${type} yet.</div>`;
      } else {
        contentEl.innerHTML = users.map(u => _personRowHTML(u)).join('');
      }
    } else if (type === 'events') {
      const res  = await fetch(`${API_BASE}/api/events?host_id=${encodeURIComponent(userId)}&limit=50`);
      const data = await res.json();
      const events = data.events || [];
      if (events.length === 0) {
        contentEl.innerHTML = `<div style="text-align:center;padding:48px 20px;color:var(--muted)">No events yet.</div>`;
      } else {
        events.forEach(ev => { _profileListEventsMap[ev.id] = ev; });
        contentEl.innerHTML = events.map(ev => _eventRowHTML(ev)).join('');
      }
    }
    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';
  } catch {
    loadingEl.textContent = 'Could not load. Try again.';
  }
}

function _openProfileFromList(userId) {
  closeSheet('profileListSheet');
  setTimeout(() => openPublicProfile(userId), 220);
}

function _openEventFromList(eventId) {
  const ev = _profileListEventsMap[eventId];
  if (!ev) return;
  closeSheet('profileListSheet');
  setTimeout(() => viewDetail(ev), 220);
}

function _personRowHTML(u) {
  const initials = (u.full_name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const avInner  = u.avatar_url
    ? `<img alt="" src="${escapeHtml(u.avatar_url)}" style="width:100%;height:100%;object-fit:cover;display:block">`
    : `<span style="font-size:15px;font-weight:700;color:#000">${initials}</span>`;
  return `<div onclick="_openProfileFromList('${u.id}')"
    style="display:flex;align-items:center;gap:12px;padding:12px 16px;cursor:pointer;border-bottom:1px solid var(--border);transition:background .15s"
    onmouseenter="this.style.background='var(--surface3)'" onmouseleave="this.style.background=''">
    <div style="width:44px;height:44px;border-radius:50%;background:${u.avatar_color||'var(--gold)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden">${avInner}</div>
    <div style="min-width:0;flex:1">
      <div style="font-weight:600;font-size:15px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(u.full_name||'ChristLink Member')}</div>
      ${u.city ? `<div style="font-size:12px;color:var(--muted);margin-top:1px">${escapeHtml(u.city)}</div>` : ''}
    </div>
    <svg style="flex-shrink:0;opacity:.4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
  </div>`;
}

function _eventRowHTML(ev) {
  const now    = new Date();
  const end    = ev.end_date ? new Date(ev.end_date) : (ev.start_date ? new Date(ev.start_date) : null);
  const isLive = !end || end >= now;
  const date   = ev.start_date ? new Date(ev.start_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '';
  const cover  = ev.cover_url
    ? `<img alt="" src="${escapeHtml(ev.cover_url)}" style="width:54px;height:54px;object-fit:cover;border-radius:8px;flex-shrink:0;display:block">`
    : `<div style="width:54px;height:54px;background:var(--surface3);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="20" height="20" viewBox="0 0 32 32" fill="none"><rect x="14" y="4" width="4" height="24" rx="1.5" fill="#C9A84C"/><rect x="6" y="11" width="20" height="4" rx="1.5" fill="#C9A84C"/></svg></div>`;
  const statusBadge = isLive
    ? `<span style="font-size:10px;font-weight:700;color:#22c55e;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.3);border-radius:999px;padding:1px 7px">Live</span>`
    : `<span style="font-size:10px;font-weight:700;color:var(--muted);background:var(--surface3);border:1px solid var(--border);border-radius:999px;padding:1px 7px">Ended</span>`;
  return `<div onclick="_openEventFromList('${ev.id}')"
    style="display:flex;align-items:center;gap:12px;padding:12px 16px;cursor:pointer;border-bottom:1px solid var(--border);transition:background .15s;${isLive ? '' : 'opacity:.6'}"
    onmouseenter="this.style.background='var(--surface3)'" onmouseleave="this.style.background=''">
    ${cover}
    <div style="min-width:0;flex:1">
      <div style="font-weight:600;font-size:14px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(ev.name||'Untitled')}</div>
      <div style="font-size:12px;color:var(--gold);margin-top:2px">${date}${ev.city ? ' · '+escapeHtml(ev.city) : ''}</div>
      <div style="display:flex;align-items:center;gap:6px;margin-top:4px">${statusBadge}<span style="font-size:11px;color:var(--muted)">${ev.is_paid ? 'Paid' : 'Free'}</span></div>
    </div>
    <svg style="flex-shrink:0;opacity:.4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
  </div>`;
}

// ── EVENT FORUM (GROUP CHAT) ──────────────────────────────────

// Measure actual element heights and position messages area correctly
function forumRelayout() {
  // Flexbox handles all layout — just scroll messages to bottom
  const msgs = document.getElementById('forumMessages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

let forumEventId  = null;
let forumEventObj = null;
let forumPosts    = [];
let forumPolling  = null;

function _forumVVResize() {
  const fp = document.getElementById('page-forum');
  if (!fp || fp.style.display === 'none' || !fp.style.display) return;
  const vv = window.visualViewport;
  if (!vv) return;
  const keyboardH = Math.max(0, window.innerHeight - Math.round(vv.height));
  // Shift the panel up above the keyboard without changing its height
  fp.style.bottom = keyboardH + 'px';
  const msgs = document.getElementById('forumMessages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function openForum(event) {
  if (typeof event === 'string') {
    forumEventId  = event;
    forumEventObj = selectedEvent || null;
  } else {
    forumEventObj = event;
    forumEventId  = event?.id;
  }
  if (!forumEventId) { showToast('Event not found.', 'error'); return; }
  forumPosts = [];
  const evName = forumEventObj?.name || forumEventObj?.title || 'Forum';
  document.getElementById('forumEventTitle').textContent = evName;
  document.getElementById('forumEventSub').textContent   = 'Loading…';
  // Set event cover photo in the group avatar
  const coverUrl   = forumEventObj?.cover_url || forumEventObj?.image_url || forumEventObj?.cover_image || null;
  const avImg      = document.getElementById('forumGroupAvImg');
  const avFallback = document.getElementById('forumGroupAvFallback');
  if (coverUrl && avImg && avFallback) {
    avImg.src               = coverUrl;
    avImg.style.display     = 'block';
    avFallback.style.display = 'none';
    avImg.onerror = () => { avImg.style.display = 'none'; avFallback.style.display = 'block'; };
  } else if (avImg && avFallback) {
    avImg.style.display      = 'none';
    avFallback.style.display = 'block';
  }
  const msgArea = document.getElementById('forumMessages');
  msgArea.innerHTML = `
    <div class="forum-empty-state">
      <div class="forum-empty-icon"><svg width="44" height="44" viewBox="0 0 32 32" fill="none"><path d="M5 6 C5 5 6 4 7 4 L22 4 C23 4 24 5 24 6 L24 16 C24 17 23 18 22 18 L14 18 L9 23 L9 18 L7 18 C6 18 5 17 5 16 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><circle cx="11" cy="11" r="1" fill="#C9A84C"/><circle cx="15" cy="11" r="1" fill="#C9A84C"/><circle cx="19" cy="11" r="1" fill="#C9A84C"/></svg></div>
      <div class="forum-empty-text">Loading messages…</div>
    </div>`;
  const ta = document.getElementById('forumTextarea');
  if (ta) { ta.value = ''; ta.style.height = ''; }
  document.getElementById('forumSendBtn').disabled = true;
  document.getElementById('forumPinnedBar').style.display = 'none';
  goTo('forum');
  const fp = document.getElementById('page-forum');
  if (fp) {
    fp.style.display = 'flex';
    fp.style.height  = Math.round(window.innerHeight * 0.5) + 'px';
    fp.style.bottom  = '0px';
  }
  // Lock body so nothing behind the panel rubber-bands on iOS
  document.body.dataset.forumScrollY = window.scrollY;
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width    = '100%';
  document.body.style.top      = `-${window.scrollY}px`;
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', _forumVVResize);
    window.visualViewport.addEventListener('resize', _forumVVResize);
  }
  loadForumPosts();
  clearInterval(forumPolling);
  forumPolling = setInterval(loadForumPosts, 8000);
  forumRelayout();
}

function openEventForum() {
  openSheet('forumComingSoonSheet');
}

function closeForum() {
  clearInterval(forumPolling);
  forumPolling = null;
  if (window.visualViewport) window.visualViewport.removeEventListener('resize', _forumVVResize);
  const fp = document.getElementById('page-forum');
  if (fp) { fp.style.height = ''; fp.style.bottom = ''; fp.style.display = ''; }
  // Restore body scroll
  const scrollY = parseFloat(document.body.dataset.forumScrollY || '0');
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width    = '';
  document.body.style.top      = '';
  window.scrollTo(0, scrollY);
  document.body.dataset.forumScrollY = '';
  if (selectedEvent?.id) goTo('event-detail');
  else goTo('home');
}

async function loadForumPosts() {
  if (!forumEventId) return;
  try {
    const res  = await fetch(`${API_BASE}/api/events/${forumEventId}/forum`, {
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    if (!res.ok) return;
    const data  = await res.json();
    const posts = data.posts || data || [];
    if (posts.length === forumPosts.length &&
        posts[posts.length-1]?.id === forumPosts[forumPosts.length-1]?.id) return;
    forumPosts = posts;
    renderForumMessages(posts);
  } catch(e) { console.warn('[forum load]', e.message); }
}

function renderForumMessages(posts) {
  const msgArea     = document.getElementById('forumMessages');
  const wasAtBottom = msgArea.scrollHeight - msgArea.scrollTop - msgArea.clientHeight < 80;
  const authors = new Set(posts.map(p => p.user_id));
  const subEl   = document.getElementById('forumEventSub');
  if (subEl) subEl.textContent = authors.size > 0
    ? `${authors.size} member${authors.size !== 1 ? 's' : ''}`
    : '';
  if (posts.length === 0) {
    msgArea.innerHTML = `
      <div class="forum-empty-state">
        <div class="forum-empty-icon"><svg width="44" height="44" viewBox="0 0 32 32" fill="none"><path d="M5 6 C5 5 6 4 7 4 L22 4 C23 4 24 5 24 6 L24 16 C24 17 23 18 22 18 L14 18 L9 23 L9 18 L7 18 C6 18 5 17 5 16 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><circle cx="11" cy="11" r="1" fill="#C9A84C"/><circle cx="15" cy="11" r="1" fill="#C9A84C"/><circle cx="19" cy="11" r="1" fill="#C9A84C"/></svg></div>
        <div class="forum-empty-text">No messages yet.<br>Be the first to say something!</div>
      </div>`;
    return;
  }

  // Preprocess: determine group position for each post (first/mid/last/solo)
  const getDate = p => new Date(p.created_at).toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' });
  const annotated = posts.map((post, i) => {
    const prev = posts[i - 1];
    const next = posts[i + 1];
    const d    = getDate(post);
    const isFirst = !prev || prev.user_id !== post.user_id || getDate(prev) !== d || prev.type === 'system';
    const isLast  = !next || next.user_id !== post.user_id || getDate(next) !== d || next.type === 'system';
    let pos = isFirst && isLast ? 'solo' : isFirst ? 'first' : isLast ? 'last' : 'mid';
    return { ...post, _d: d, _isFirst: isFirst, _isLast: isLast, _pos: pos };
  });

  let html        = '';
  let lastDateStr = '';
  annotated.forEach(post => {
    if (post._d !== lastDateStr) {
      lastDateStr = post._d;
      html += `<div class="forum-date-sep"><span>${escapeHtml(post._d)}</span></div>`;
    }
    if (post.type === 'system') {
      html += `<div class="forum-system-msg"><span>${escapeHtml(post.content)}</span></div>`;
      return;
    }
    const isOwn     = post.user_id === currentUser?.id;
    const name      = post.profiles?.full_name || 'Member';
    const avUrl     = post.profiles?.avatar_url;
    const avColor   = post.profiles?.avatar_color || '#2d2d44';
    const avInitial = name.charAt(0).toUpperCase();
    const ts        = new Date(post.created_at);
    const timeStr   = ts.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
    const isOpt     = post.id?.startsWith('opt-');

    // Avatar: show only on the LAST message of a group (Telegram/WhatsApp style)
    const avHtml = !isOwn
      ? (post._isLast
          ? (avUrl
              ? `<div class="forum-msg-av" style="cursor:pointer" onclick="openPublicProfile('${post.user_id}')"><img src="${escapeHtml(avUrl)}" alt=""></div>`
              : `<div class="forum-msg-av" style="background:${avColor};cursor:pointer" onclick="openPublicProfile('${post.user_id}')">${avInitial}</div>`)
          : `<div style="width:28px;flex-shrink:0"></div>`)
      : '';

    const tickHtml = isOwn ? `<span class="forum-msg-tick${isOpt ? '' : ' seen'}" style="display:inline-flex"><svg width="14" height="10" viewBox="0 0 20 12" fill="none"><path d="M1 6L4.5 10L10 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 6L10.5 10L16 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>` : '';
    const delHtml  = isOwn && !isOpt
      ? `<button class="forum-msg-del" id="fdel-${post.id}" onclick="forumDeletePost('${post.id}')">Delete</button>`
      : '';

    // Name: only on first of group; time: only on last of group
    const nameHtml = !isOwn && post._isFirst
      ? `<div class="forum-msg-name" style="cursor:pointer" onclick="openPublicProfile('${post.user_id}')">${escapeHtml(name)}</div>`
      : '';
    const metaHtml = post._isLast
      ? `<div class="forum-msg-meta"><span class="forum-msg-time">${timeStr}</span>${tickHtml}${delHtml}</div>`
      : (delHtml ? `<div class="forum-msg-meta">${delHtml}</div>` : '');

    // Spacing: tighter within a group, looser between groups
    const mb = post._isLast ? '8px' : '2px';

    html += `
      <div class="forum-msg-row${isOwn ? ' own' : ''}" data-id="${post.id}" style="margin-bottom:${mb}">
        ${!isOwn ? avHtml : ''}
        <div class="forum-msg-body">
          ${nameHtml}
          <div class="forum-bubble b-${post._pos}"
            onclick="${isOwn ? `forumBubbleTap('${post.id}')` : ''}"
            style="opacity:${isOpt ? '0.6' : '1'}">
            ${post.image_url
              ? `<img alt="" src="${escapeHtml(post.image_url)}"
                  style="max-width:220px;max-height:200px;border-radius:12px;display:block;margin-top:${post.content||post.body ? '6px' : '0'}"
                  onerror="this.style.display='none'">`
              : ''}
            ${escapeHtml(post.content || '')}
          </div>
          ${metaHtml}
        </div>
      </div>`;
  });
  msgArea.innerHTML = html;
  if (wasAtBottom || forumPosts.length <= 2) {
    requestAnimationFrame(() => { msgArea.scrollTop = msgArea.scrollHeight; });
  }
}

function forumBubbleTap(postId) {
  const delBtn = document.getElementById(`fdel-${postId}`);
  if (!delBtn) return;
  const wasVisible = delBtn.classList.contains('visible');
  document.querySelectorAll('.forum-msg-del.visible').forEach(b => b.classList.remove('visible'));
  if (!wasVisible) delBtn.classList.add('visible');
}

async function submitForumPost() {
  if (!currentSession?.access_token) { showToast('Please sign in to post.', 'error'); return; }
  const ta       = document.getElementById('forumTextarea');
  const sendBtn  = document.getElementById('forumSendBtn');
  const content  = ta?.value.trim();
  const hasImage = !!_forumPendingImage;
  if (!content && !hasImage) return;
  if (!forumEventId) return;

  sendBtn.disabled = true;
  const imageFile  = _forumPendingImage?.file || null;
  ta.value         = '';
  ta.style.height  = '';
  forumClearImage();

  // Upload image if attached
  let uploadedImageUrl = null;
  if (imageFile) {
    try {
      uploadedImageUrl = await forumUploadImage(imageFile);
    } catch(uploadErr) {
      showToast('Image upload failed. Try again.', 'error');
      sendBtn.disabled = false;
      return;
    }
  }

  const optimistic = {
    id:           `opt-${Date.now()}`,
    content,
    image_url:    uploadedImageUrl || null,
    message_type: uploadedImageUrl ? 'image' : 'text',
    user_id:      currentUser?.id,
    created_at:   new Date().toISOString(),
    profiles: {
      full_name:    profileData?.full_name || currentUser?.email?.split('@')[0] || 'You',
      avatar_url:   profileData?.avatar_url   || null,
      avatar_color: profileData?.avatar_color || '#2d2d44',
    },
  };
  forumPosts = [...forumPosts, optimistic];
  renderForumMessages(forumPosts);
  try {
    const res = await fetch(`${API_BASE}/api/events/${forumEventId}/forum`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession.access_token}` },
      body:    JSON.stringify({ content: content || null, image_url: uploadedImageUrl || null, message_type: uploadedImageUrl ? 'image' : 'text' }),
    });
    forumPosts = forumPosts.filter(p => p.id !== optimistic.id);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showToast(err.error || 'Could not send message.', 'error');
      renderForumMessages(forumPosts);
    } else {
      await loadForumPosts();
    }
  } catch(e) {
    console.error('[forum send]', e.message);
    showToast('Network error — check your connection.', 'error');
    forumPosts = forumPosts.filter(p => p.id !== optimistic.id);
    renderForumMessages(forumPosts);
    ta.value = content;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 110) + 'px';
  }
  sendBtn.disabled = !ta.value.trim();
  ta.focus();
}

// ── FORUM IMAGE UPLOAD ────────────────────────────────────────
let _forumPendingImage = null;

function forumHandleImageSelect(input) {
  const file = input.files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast('Image must be under 5MB.', 'error');
    input.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    _forumPendingImage = { file, dataUrl: e.target.result };
    const preview = document.getElementById('forumImagePreview');
    const thumb   = document.getElementById('forumImageThumb');
    const name    = document.getElementById('forumImageName');
    if (preview) preview.style.display = 'flex';
    if (thumb)   thumb.src = e.target.result;
    if (name)    name.textContent = file.name;
    document.getElementById('forumSendBtn').disabled = false;
    forumRelayout();
  };
  reader.readAsDataURL(file);
}

function forumClearImage() {
  _forumPendingImage = null;
  const preview = document.getElementById('forumImagePreview');
  if (preview) preview.style.display = 'none';
  const input = document.getElementById('forumImageInput');
  if (input) input.value = '';
  const ta = document.getElementById('forumTextarea');
  document.getElementById('forumSendBtn').disabled = !ta?.value.trim();
  forumRelayout();
}

async function forumUploadImage(file) {
  // _forumPendingImage.dataUrl already read by FileReader — reuse it
  const dataUrl = _forumPendingImage?.dataUrl || await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const upRes = await fetch(`${API_BASE}/api/upload-forum-image`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession.access_token}` },
    body:    JSON.stringify({ dataUrl }),
  });
  if (!upRes.ok) {
    const err = await upRes.json().catch(() => ({}));
    throw new Error(err.error || 'Upload failed');
  }
  const { url } = await upRes.json();
  return url;
}

async function forumDeletePost(postId) {
  if (!postId || postId.startsWith('opt-')) return;
  try {
    const res = await fetch(`${API_BASE}/api/forum/${postId}`, {
      method:  'DELETE',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    if (!res.ok) throw new Error();
    forumPosts = forumPosts.filter(p => p.id !== postId);
    renderForumMessages(forumPosts);
  } catch { showToast('Could not delete message.', 'error'); }
}

function forumTextareaInput(ta) {
  ta.style.height = 'auto';
  ta.style.height = Math.min(ta.scrollHeight, 110) + 'px';
  document.getElementById('forumSendBtn').disabled = !ta.value.trim();
}

function forumTextareaKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) {
    e.preventDefault();
    submitForumPost();
  }
}

// ─── LEGACY FORUM VARS (kept so nothing else breaks) ──────────
let forumIsHost = false;

async function loadForumCount(eventId) {
  try {
    const res  = await fetch(`${API_BASE}/api/events/${eventId}/forum`);
    const data = await res.json();
    const el      = document.getElementById('detailForumCount');
    const section = document.getElementById('detailForumSection');
    if (!el) return;
    if (data.posts?.length)   el.textContent = `${data.posts.length} post${data.posts.length !== 1 ? 's' : ''}`;
    else                      el.textContent = 'Be the first to post!';
  } catch {
    const el = document.getElementById('detailForumCount');
    if (el) el.textContent = 'Chat with people going';
  }
}

// ── Live update state ─────────────────────────────────────────
let _commChannel    = null;
let _commPollTimer  = null;

function startCommunityLive() {
  stopCommunityLive();
  try {
    _commChannel = sb.channel('community-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
        if (document.getElementById('page-community')?.classList.contains('active')) {
          initCommunityFeed(true); // silent — never blank the feed on realtime update
        }
      })
      .subscribe();
  } catch(e) {}
  // 30s interval, always silent — feed never blanks on background poll
  _commPollTimer = setInterval(() => {
    if (document.getElementById('page-community')?.classList.contains('active')) {
      initCommunityFeed(true);
    }
  }, 30000);
}

function stopCommunityLive() {
  if (_commChannel)   { try { sb.removeChannel(_commChannel); } catch(e){} _commChannel = null; }
  if (_commPollTimer) { clearInterval(_commPollTimer); _commPollTimer = null; }
}

// Clean up all Realtime channels and poll timers on page unload
// to avoid WebSocket leaks / orphaned subscriptions in the Supabase dashboard.
window.addEventListener('beforeunload', () => {
  clearInterval(forumPolling);
  stopCommunityLive();
});

function switchPTab(el, tab) {
  document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.profile-tab-panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('ptab-' + tab).classList.add('active');
  if (tab === 'events')  fetchMyEvents();
  if (tab === 'tickets') fetchMyTickets();
}

// ─── PROFILE HELPERS ────────────────────────────────────────
function populateBibleVersions() {
  const sel = document.getElementById('epBibleVersion');
  if (!sel || sel.options.length > 0) return;
  sel.innerHTML = BIBLE_VERSIONS.map(v => `<option value="${v.code}">${v.code}</option>`).join('');
}

function renderHobbyChipsEdit(savedHobbies = '') {
  const container = document.getElementById('epHobbiesGrid');
  if (!container) return;
  // Parse saved hobbies string into array
  const saved = savedHobbies.split(',').map(h => h.trim().toLowerCase()).filter(Boolean);
  container.innerHTML = PRESET_HOBBIES.map(hobby => {
    const isSelected = saved.some(s => s === hobby.toLowerCase());
    return `<button type="button" class="ep-hobby-chip${isSelected ? ' selected' : ''}"
      onclick="this.classList.toggle('selected')">${hobbyIcon(hobby)}${hobby}</button>`;
  }).join('');
}

function getSelectedHobbies() {
  const chips = [...document.querySelectorAll('#epHobbiesGrid .ep-hobby-chip.selected')];
  return chips.map(c => c.textContent.trim()).join(', ') || null;
}

function renderConnectTagsEdit(selectedTags = []) {
  const container = document.getElementById('epConnectTags');
  if (!container) return;
  container.innerHTML = CONNECT_TAGS.map(tag => `
    <button type="button" class="connect-tag-btn ${selectedTags.includes(tag.id) ? 'active' : ''}"
      data-tag="${tag.id}" onclick="this.classList.toggle('active')">
      <span class="tag-icon" style="display:flex;flex-shrink:0">${icon(tag.iconName, 18)}</span><span>${tag.label}</span>
    </button>`).join('');
}

function getSelectedConnectTags() {
  return [...document.querySelectorAll('#epConnectTags .connect-tag-btn.active')].map(b => b.dataset.tag);
}

function epHandleBanner(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    // Compress banner via canvas (max 1200px wide, jpeg 85%)
    const srcImg = new Image();
    srcImg.onload = () => {
      const MAX = 1200;
      const scale = Math.min(1, MAX / srcImg.width);
      const w = Math.round(srcImg.width * scale);
      const h = Math.round(srcImg.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(srcImg, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      // Show preview immediately
      document.getElementById('epBannerImg').src = dataUrl;
      document.getElementById('epBannerPreview').style.display = 'block';
      document.getElementById('epBannerPlaceholder').style.display = 'none';
      // Upload async — store URL when done
      fetch(`${API_BASE}/api/upload-banner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
        body: JSON.stringify({ dataUrl }),
      }).then(r => r.json()).then(d => {
        if (d.url) {
          window._epBannerUrl = d.url;
          document.getElementById('epBannerImg').src = d.url;
        }
      }).catch(() => showToast('Banner upload failed', 'error'));
    };
    srcImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function epRemoveBanner() {
  document.getElementById('epBannerPreview').style.display = 'none';
  document.getElementById('epBannerPlaceholder').style.display = 'flex';
  document.getElementById('epBannerInput').value = '';
  window._epBannerUrl = null;
}

// ─── EDIT PROFILE ───────────────────────────────────────────
async function openEditProfile() {
  openSheet('editProfileSheet');
  if (!profileData?.full_name) await fetchProfile();
  populateEditProfile();
}

function populateEditProfile() {
  const name = profileData?.full_name || currentUser?.user_metadata?.full_name || '';
  document.getElementById('epName').value      = name;
  document.getElementById('epCity').value      = profileData?.city          || '';
  document.getElementById('epBio').value       = profileData?.bio           || '';
  document.getElementById('epInstagram').value = profileData?.instagram_url || '';
  document.getElementById('epFacebook').value  = profileData?.facebook_url  || '';
  document.getElementById('epTikTok').value    = profileData?.tiktok_url    || '';
  // New profile fields
  populateBibleVersions();
  document.getElementById('epBibleVerse').value   = profileData?.bible_verse           || '';
  document.getElementById('epBibleRef').value     = profileData?.bible_verse_reference || '';
  const verSel = document.getElementById('epBibleVersion');
  if (verSel) verSel.value = profileData?.bible_version || 'NIV';
  const hotTakes = profileData?.hot_takes || '';
  document.getElementById('epHotTakes').value     = hotTakes;
  document.getElementById('epHotTakesCount').textContent = hotTakes.length + '/300';
  // Render hobby preset chips
  renderHobbyChipsEdit(profileData?.hobbies || '');
  renderConnectTagsEdit(profileData?.connect_tags || []);
  // Prayer Request + Testimony
  const pr = profileData?.prayer_request || '';
  const ts = profileData?.testimony || '';
  document.getElementById('epPrayerRequest').value = pr;
  document.getElementById('epPrayerCharCount').textContent = pr.length + '/400';
  document.getElementById('epTestimony').value = ts;
  document.getElementById('epTestimonyCharCount').textContent = ts.length + '/600';
  // Banner
  const bannerUrl = profileData?.banner_url || null;
  window._epBannerUrl = bannerUrl;
  if (bannerUrl) {
    document.getElementById('epBannerImg').src = bannerUrl;
    document.getElementById('epBannerPreview').style.display = 'block';
    document.getElementById('epBannerPlaceholder').style.display = 'none';
  } else {
    document.getElementById('epBannerPreview').style.display = 'none';
    document.getElementById('epBannerPlaceholder').style.display = 'flex';
  }
  // preview
  const prev = document.getElementById('epPreview');
  prev.innerHTML = '';
  if (profileData?.avatar_url) {
    const img = document.createElement('img');
    img.src = profileData.avatar_url;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%';
    prev.appendChild(img);
    prev.style.background = 'transparent';
  } else {
    prev.textContent = name.charAt(0).toUpperCase();
    if (profileData?.avatar_color) prev.style.background = profileData.avatar_color;
  }
  epAvatarColor = profileData?.avatar_color || null;
  epAvatarUrl   = null;
  // color grid
  const grid = document.getElementById('epColorGrid');
  grid.innerHTML = '';
  AVATAR_COLORS.forEach(bg => {
    const btn = document.createElement('button');
    btn.className = 'av-btn' + (profileData?.avatar_color === bg ? ' sel':'');
    btn.style.background = bg;
    btn.textContent = name.charAt(0).toUpperCase();
    btn.onclick = () => {
      epAvatarColor = bg; epAvatarUrl = null;
      grid.querySelectorAll('.av-btn').forEach(b=>b.classList.remove('sel'));
      btn.classList.add('sel');
      prev.style.background = bg;
      prev.innerHTML = '';
      prev.textContent = (document.getElementById('epName').value||'U').charAt(0).toUpperCase();
    };
    grid.appendChild(btn);
  });

  // Ring color picker
  epRingColor = profileData?.avatar_ring_color || null;
  const applyRingToPreview = color => {
    prev.style.outline = color ? `3px solid ${color}` : 'none';
    prev.style.outlineOffset = '3px';
  };
  applyRingToPreview(epRingColor);
  const RING_COLORS = [
    { label: 'None',   value: null,      swatch: 'transparent', border: '2px dashed rgba(255,255,255,.3)' },
    { label: 'Gold',   value: '#C9A84C', swatch: '#C9A84C',     border: 'none' },
    { label: 'Purple', value: '#9B5DE5', swatch: '#9B5DE5',     border: 'none' },
    { label: 'Blue',   value: '#4B96E8', swatch: '#4B96E8',     border: 'none' },
    { label: 'Green',  value: '#4EC98C', swatch: '#4EC98C',     border: 'none' },
    { label: 'Pink',   value: '#FF6BAE', swatch: '#FF6BAE',     border: 'none' },
    { label: 'Red',    value: '#E05050', swatch: '#E05050',     border: 'none' },
    { label: 'Orange', value: '#F4855F', swatch: '#F4855F',     border: 'none' },
    { label: 'Cyan',   value: '#00C4D8', swatch: '#00C4D8',     border: 'none' },
    { label: 'White',  value: '#FFFFFF', swatch: '#FFFFFF',     border: 'none' },
  ];
  const ringGrid = document.getElementById('epRingGrid');
  ringGrid.innerHTML = '';
  RING_COLORS.forEach(({ label, value, swatch, border }) => {
    const isSelected = value === epRingColor || (value === null && !epRingColor);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = label;
    btn.style.cssText = `width:32px;height:32px;border-radius:50%;background:${swatch};border:${border};cursor:pointer;touch-action:manipulation;position:relative;box-shadow:${isSelected ? '0 0 0 2px #fff,0 0 0 4px #C9A84C' : '0 0 0 1px rgba(255,255,255,.15)'};transition:box-shadow .15s`;
    if (value === null) btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"><path d="M2 2L12 12M12 2L2 12" stroke="rgba(255,255,255,.5)" stroke-width="1.8" stroke-linecap="round"/></svg>';
    btn.onclick = () => {
      epRingColor = value;
      ringGrid.querySelectorAll('button').forEach(b => { b.style.boxShadow = '0 0 0 1px rgba(255,255,255,.15)'; });
      btn.style.boxShadow = '0 0 0 2px #fff,0 0 0 4px #C9A84C';
      applyRingToPreview(value);
    };
    ringGrid.appendChild(btn);
  });
}

function epHandlePhoto(input) {
  const file = input.files[0]; if (!file) return;
  const r = new FileReader();
  r.onload = e => {
    // Compress + resize via canvas (max 600px, JPEG 82%) to keep upload fast
    const srcImg = new Image();
    srcImg.onload = () => {
      const MAX = 600;
      const scale = Math.min(1, MAX / Math.max(srcImg.width, srcImg.height));
      const w = Math.round(srcImg.width * scale);
      const h = Math.round(srcImg.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(srcImg, 0, 0, w, h);
      epAvatarUrl   = canvas.toDataURL('image/jpeg', 0.82);
      epAvatarColor = null;
      // Update sheet preview
      const prev = document.getElementById('epPreview');
      prev.innerHTML = '';
      prev.style.background = 'transparent';
      const thumb = document.createElement('img');
      thumb.src = epAvatarUrl;
      thumb.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%';
      prev.appendChild(thumb);
      document.querySelectorAll('.av-btn').forEach(b => b.classList.remove('sel'));
      // Live-update profile page avatar so user sees it immediately
      const profAvEl = document.getElementById('profAv');
      if (profAvEl) {
        profAvEl.innerHTML = '';
        profAvEl.style.background = 'transparent';
        const liveThumb = document.createElement('img');
        liveThumb.src = epAvatarUrl;
        liveThumb.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%';
        profAvEl.appendChild(liveThumb);
      }
    };
    srcImg.src = e.target.result;
  };
  r.readAsDataURL(file);
}

async function saveProfile() {
  const name = document.getElementById('epName').value.trim();
  const errEl = document.getElementById('epErr');
  if (!name) { errEl.textContent='Please enter your name.'; errEl.classList.add('show'); return; }
  errEl.classList.remove('show');
  const btn = document.getElementById('epSaveBtn');
  btn.disabled = true; btn.innerHTML = '<div class="spinner spinner-gold"></div>&nbsp;Saving…';

  // Upload avatar photo via server (server uses admin key — bypasses storage RLS)
  let avatarUrl = profileData?.avatar_url || null;
  if (epAvatarUrl?.startsWith('data:')) {
    btn.innerHTML = '<div class="spinner spinner-gold"></div>&nbsp;Uploading photo…';
    try {
      const upRes = await fetch(`${API_BASE}/api/upload-avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
        body: JSON.stringify({ dataUrl: epAvatarUrl }),
      });
      const upData = await upRes.json();
      if (!upRes.ok) throw new Error(upData.error || 'Upload failed');
      avatarUrl = upData.url;
    } catch (e) {
      btn.disabled = false; btn.innerHTML = 'Save Changes';
      errEl.textContent = 'Photo upload failed: ' + e.message;
      errEl.classList.add('show');
      return;
    }
    btn.innerHTML = '<div class="spinner spinner-gold"></div>&nbsp;Saving…';
  }

  const updates = {
    full_name:             name,
    bio:                   document.getElementById('epBio').value.trim(),
    city:                  document.getElementById('epCity').value.trim(),
    avatar_url:            avatarUrl,
    avatar_color:          epAvatarColor || profileData?.avatar_color || null,
    avatar_ring_color:     epRingColor !== undefined ? epRingColor : (profileData?.avatar_ring_color || null),
    instagram_url:         document.getElementById('epInstagram').value.trim() || null,
    facebook_url:          document.getElementById('epFacebook').value.trim()  || null,
    tiktok_url:            document.getElementById('epTikTok').value.trim()    || null,
    banner_url:            window._epBannerUrl || null,
    bible_verse:           document.getElementById('epBibleVerse').value.trim() || null,
    bible_verse_reference: document.getElementById('epBibleRef').value.trim()   || null,
    bible_version:         document.getElementById('epBibleVersion')?.value     || 'NIV',
    hot_takes:             document.getElementById('epHotTakes').value.trim()   || null,
    hobbies:               getSelectedHobbies() || null,
    connect_tags:          getSelectedConnectTags(),
    prayer_request:        document.getElementById('epPrayerRequest').value.trim() || null,
    testimony:             document.getElementById('epTestimony').value.trim()     || null,
  };

  try {
    const res = await fetch(`${API_BASE}/api/profile`, {
      method:  'PATCH',
      headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${currentSession?.access_token}` },
      body:    JSON.stringify(updates),
    });
    if (res.ok) {
      const saved = await res.json();
      profileData = { ...profileData, ...saved };
    } else {
      const e = await res.json().catch(()=>({}));
      errEl.textContent = e.error || 'Save failed. Please try again.';
      errEl.classList.add('show');
      btn.disabled = false;
      btn.innerHTML = 'Save Changes';
      return;
    }
  } catch {
    errEl.textContent = 'Network error. Please try again.';
    errEl.classList.add('show');
    btn.disabled = false;
    btn.innerHTML = 'Save Changes';
    return;
  }

  // Update Supabase auth metadata for name
  await sb.auth.updateUser({ data:{ full_name: name } }).catch(()=>{});

  closeSheet('editProfileSheet');
  syncAuthUI();
  renderProfilePage();
  showToast('Profile updated!', 'success');
  btn.disabled = false;
  btn.innerHTML = 'Save Changes';
  // Refresh home feed so city/preference changes show up immediately
  fetchHomeEvents();
  fetchDiscoveryRows();
}

// ═══════════════════════════════════════════════════════════
// EVENT CARDS
// ═══════════════════════════════════════════════════════════
const BG_GRADIENTS = [
  'linear-gradient(135deg,#1A0E38,#0F0F1A)',
  'linear-gradient(135deg,#0E2438,#0F1A1A)',
  'linear-gradient(135deg,#1A0E18,#200F0F)',
  'linear-gradient(135deg,#0E3820,#0F1A15)',
  'linear-gradient(135deg,#2A1800,#1A1000)',
];

const AVATAR_COLORS_CARD = ['#C9A84C','#4E7CFF','#4EC98C','#FF6B6B','#A882FF','#FF9F43'];
function makeCardHTML(ev, scrollMode) {
  const fmtDate = ev.start_date
    ? new Date(ev.start_date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})
    : 'Date TBD';
  const isPaid = ev.is_paid;
  const price  = isPaid && ev.ticket_types?.[0] ? `$${(ev.ticket_types[0].price_cents/100).toFixed(2)}` : null;
  const bg = BG_GRADIENTS[Math.abs((ev.name||'').charCodeAt(0)) % BG_GRADIENTS.length];
  const going = Number(ev.confirmed_rsvps) || 0;

  // Stacked avatar circles for social proof
  const avatarStack = going > 0
    ? `<div style="display:flex;align-items:center;gap:6px">
        <div style="display:flex">
          ${[...Array(Math.min(3, going))].map((_, i) => {
            const c = AVATAR_COLORS_CARD[(Math.abs((ev.name||'x').charCodeAt(i*2)) + i) % AVATAR_COLORS_CARD.length];
            return `<div style="width:22px;height:22px;border-radius:50%;background:${c};border:2px solid rgba(0,0,0,.6);margin-left:${i>0?'-7px':'0'};flex-shrink:0"></div>`;
          }).join('')}
        </div>
        <span class="card-going" style="font-size:11px;color:rgba(255,255,255,.8);font-weight:600">${going > 99 ? '99+' : going} going</span>
      </div>`
    : `<span></span>`;

  const card = document.createElement('div');
  card.className = 'event-card';
  card.dataset.id = ev.id;
  card.innerHTML = `
    <div style="position:absolute;inset:0;background:${bg}"></div>
    ${ev.cover_url
      ? `<img class="card-img" src="${ev.cover_url}" alt="${escapeAttr(ev.name||'')}" loading="lazy">`
      : `<div class="card-img-emoji" style="display:flex;align-items:center;justify-content:center"><svg width="40" height="40" viewBox="0 0 32 32" fill="none"><rect x="14" y="4" width="4" height="24" rx="1.5" fill="#C9A84C"/><rect x="6" y="11" width="20" height="4" rx="1.5" fill="#C9A84C"/></svg></div>`}
    <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.4) 50%,rgba(0,0,0,.08) 100%)"></div>
    <div class="card-badges">
      <span class="badge badge-type">${ev.event_type || 'Event'}</span>
      <span class="badge ${isPaid ? 'badge-paid' : 'badge-free'}">${isPaid ? (price || 'Paid') : 'Free'}</span>
    </div>
    <div class="card-overlay">
      <div class="card-date">${fmtDate}</div>
      <div class="card-name">${escapeHtml(ev.name || 'Untitled')}</div>
      <div class="card-loc">
        <svg width="8" height="10" viewBox="0 0 10 13" fill="rgba(255,255,255,.55)"><path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5a1.5 1.5 0 0 1 0 3z"/></svg>
        ${ev.city ? `${escapeHtml(ev.city)}${ev.state ? ', '+ev.state : ''}` : (ev.format==='online'?'Online':'TBD')}
      </div>
      <div class="card-footer">
        ${avatarStack}
        <button class="card-share-btn" aria-label="Share event" onclick="event.stopPropagation();shareEventById('${ev.id}','${escapeAttr(ev.name||'')}','${escapeAttr(ev.description||'')}',this)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </button>
      </div>
    </div>`;
  card.onclick = () => viewDetail(ev);
  return card;
}

function renderInto(container, events, scrollMode) {
  container.innerHTML = '';
  if (!events || events.length === 0) {
    const wrap = document.createElement('div');
    wrap.style.cssText = scrollMode ? 'width:100%;padding:40px 20px' : 'grid-column:1/-1';
    wrap.innerHTML = emptyStateHTML('search', 'No events yet', 'Be the first to host in your city.', 'Host an Event →', "goTo('host')");
    container.appendChild(wrap);
    return;
  }
  events.forEach(ev => {
    const card = makeCardHTML(ev, scrollMode);
    container.appendChild(card);
  });
}


// ═══════════════════════════════════════════════════════════
// DATETIME HELPERS  (datetime-local <-> UTC ISO)
// ═══════════════════════════════════════════════════════════
// Convert datetime-local input value (local time) to UTC ISO string for server
function localInputToISO(val) {
  if (!val) return null;
  return new Date(val).toISOString();
}
// Convert UTC ISO string from server to datetime-local input value (local time)
function isoToLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ═══════════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════════
function homePill(el, filter) {
  document.querySelectorAll('#homePills .pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  // Reset Near Me button when switching pill filters
  const nearBtn = document.getElementById('nearMeHomeBtn');
  if (nearBtn) {
    nearBtn.classList.remove('active');
    nearBtn.innerHTML = `<svg width="11" height="14" viewBox="0 0 10 13" fill="none"><path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5a1.5 1.5 0 0 1 0 3z" fill="currentColor"/></svg> Near Me`;
  }
  // Skip city filter on all pill clicks so events from any city are shown
  fetchHomeEvents(filter === 'all' ? {_showAll: true} : {type: filter, _showAll: true});
}

async function fetchHomeEvents(params = {}) {
  const scroll = document.getElementById('homeScroll');
  scroll.innerHTML = [1,2,3].map(() => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-card-img"></div>
      <div class="skeleton-card-body">
        <div class="skeleton skeleton-line skeleton-line-xshort"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line skeleton-line-short"></div>
      </div>
    </div>`).join('');
  try {
    const merged = { ...params };
    delete merged._showAll;
    const qs = new URLSearchParams(merged);
    const res = await fetch(`${API_BASE}/api/events?${qs}`);
    const data = await res.json();
    renderInto(scroll, data.events, true);
  } catch {
    renderInto(scroll, [], true);
  }
}

// Navigate to browse page with a pre-applied filter
function browseTo(type, isPaid) {
  goTo('browse');
  setTimeout(() => {
    if (type) { document.getElementById('browseSearch').value = type; }
    runBrowse();
  }, 300);
}

async function fetchDiscoveryRows() {
  try {
    const [trendingRes, worshipRes, freeRes] = await Promise.all([
      fetch(`${API_BASE}/api/events?limit=12`),
      fetch(`${API_BASE}/api/events?type=worship&limit=10`),
      fetch(`${API_BASE}/api/events?is_paid=false&limit=10`),
    ]);
    const [allEvents, worship, free] = await Promise.all([
      trendingRes.ok ? (await trendingRes.json()).events || [] : [],
      worshipRes.ok  ? (await worshipRes.json()).events  || [] : [],
      freeRes.ok     ? (await freeRes.json()).events     || [] : [],
    ]);

    // Trending = sorted by attendance, skip events already in "Upcoming"
    const trending = [...allEvents]
      .sort((a,b) => (Number(b.confirmed_rsvps)||0) - (Number(a.confirmed_rsvps)||0))
      .filter(e => (Number(e.confirmed_rsvps)||0) > 0)
      .slice(0, 8);
    const tEl = document.getElementById('discTrending');
    if (trending.length > 0) {
      renderInto(document.getElementById('trendingScroll'), trending, true);
      tEl.style.display = '';
    }

    // Worship Nights
    const wEl = document.getElementById('discWorship');
    if (worship.length > 0) {
      renderInto(document.getElementById('worshipScroll'), worship, true);
      wEl.style.display = '';
    }

    // Free Events — exclude anything already shown
    const shown = new Set([...trending, ...worship].map(e => e.id));
    const freeUniq = free.filter(e => !shown.has(e.id));
    const fEl = document.getElementById('discFree');
    if (freeUniq.length > 0) {
      renderInto(document.getElementById('freeScroll'), freeUniq, true);
      fEl.style.display = '';
    }
  } catch(e) {
    console.warn('[discovery rows]', e.message);
  }
}

function heroSearchGo() {
  const q = document.getElementById('heroSearch').value.trim();
  goTo('browse');
  if (q) { setTimeout(() => { document.getElementById('browseSearch').value = q; runBrowse(); }, 350); }
}

function enableNearMeHome(btn) {
  btn.classList.add('active');
  btn.innerHTML = `<svg width="11" height="14" viewBox="0 0 10 13" fill="none"><path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5a1.5 1.5 0 0 1 0 3z" fill="currentColor"/></svg> Locating…`;
  getUserLocation(loc => {
    btn.innerHTML = `<svg width="11" height="14" viewBox="0 0 10 13" fill="none"><path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5a1.5 1.5 0 0 1 0 3z" fill="currentColor"/></svg> ${loc.city||'Near You'}`;
    fetchHomeEvents({ lat: loc.lat, lng: loc.lng, radius: 100 });
  });
}

// ═══════════════════════════════════════════════════════════
// BROWSE
// ═══════════════════════════════════════════════════════════
let browseReady = false;
let browseDebounce;

function initBrowse() {
  if (browseReady) return;
  browseReady = true;
  runBrowse();
}

function debounceBrowse(q) {
  clearTimeout(browseDebounce);
  browseDebounce = setTimeout(() => runBrowse(), 350);
}

async function runBrowse() {
  const q       = document.getElementById('browseSearch')?.value.trim() || '';
  const grid    = document.getElementById('browseGrid');
  const count   = document.getElementById('browseCount');
  if (!grid) return;
  grid.innerHTML = [1,2,3].map(() => `
    <div class="skeleton-card events-grid">
      <div class="skeleton skeleton-card-img" style="height:200px"></div>
      <div class="skeleton-card-body">
        <div class="skeleton skeleton-line skeleton-line-xshort"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line skeleton-line-short"></div>
      </div>
    </div>`).join('');
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (activeFilters.type.length)   params.set('type',   activeFilters.type[0]);
  if (activeFilters.format.length) params.set('format', activeFilters.format[0]);
  if (activeFilters.price.includes('free'))  params.set('is_paid','false');
  if (activeFilters.price.includes('paid'))  params.set('is_paid','true');
  if (nearMeActive && userLocation?.lat) { params.set('lat', userLocation.lat); params.set('lng', userLocation.lng); params.set('radius', 100); }
  try {
    const res  = await fetch(`${API_BASE}/api/events?${params}`);
    const data = await res.json();
    renderInto(grid, data.events, false);
    if (count) count.textContent = data.events?.length ? `${data.events.length} event${data.events.length!==1?'s':''}` : '';
  } catch {
    renderInto(grid, [], false);
    if (count) count.textContent = '';
  }
  renderActiveFilterTags();
}

// ─── FILTER CHIPS ────────────────────────────────────────────
function toggleFilterChip(el) {
  el.classList.toggle('active');
}

function clearFilters() {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  activeFilters = {type:[],price:[],format:[]};
  renderActiveFilterTags();
}

function applyFilters() {
  activeFilters = {type:[],price:[],format:[]};
  document.querySelectorAll('.filter-chip.active').forEach(c => {
    activeFilters[c.dataset.filter].push(c.dataset.val);
  });
  closeSheet('filterSheet');
  runBrowse();
  const hasFilters = Object.values(activeFilters).some(a=>a.length>0);
  document.getElementById('filterToggleBtn').classList.toggle('has-filters', hasFilters);
}

function renderActiveFilterTags() {
  const row = document.getElementById('activeFiltersRow');
  if (!row) return;
  row.innerHTML = '';
  const all = [...activeFilters.type,...activeFilters.price,...activeFilters.format];
  all.forEach(f => {
    const chip = document.createElement('div');
    chip.className = 'pill active';
    chip.style.cssText = 'height:28px;font-size:12px;padding:0 10px';
    chip.innerHTML = `${f} <span style="margin-left:4px;opacity:.6">×</span>`;
    chip.onclick = () => {
      activeFilters.type    = activeFilters.type.filter(v=>v!==f);
      activeFilters.price   = activeFilters.price.filter(v=>v!==f);
      activeFilters.format  = activeFilters.format.filter(v=>v!==f);
      document.querySelectorAll(`.filter-chip[data-val="${f}"]`).forEach(c=>c.classList.remove('active'));
      runBrowse();
    };
    row.appendChild(chip);
  });
}

// near me toggle
function toggleNearMe() {
  const btn = document.getElementById('browseNearToggle');
  if (nearMeActive) {
    nearMeActive = false;
    btn.classList.remove('active');
    btn.innerHTML = `<svg width="11" height="14" viewBox="0 0 10 13" fill="none"><path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5a1.5 1.5 0 0 1 0 3z" fill="currentColor"/></svg> Near Me`;
    runBrowse(); return;
  }
  btn.innerHTML = `<svg width="11" height="14" viewBox="0 0 10 13" fill="none"><path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5a1.5 1.5 0 0 1 0 3z" fill="currentColor"/></svg> Locating…`;
  getUserLocation(loc => {
    nearMeActive = true;
    btn.classList.add('active');
    btn.innerHTML = `<svg width="11" height="14" viewBox="0 0 10 13" fill="none"><path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5a1.5 1.5 0 0 1 0 3z" fill="currentColor"/></svg> ${loc.city||'Near You'}`;
    runBrowse();
  });
}

function getUserLocation(cb) {
  if (userLocation) { cb(userLocation); return; }
  if (!navigator.geolocation) { showToast('Location not supported','error'); return; }
  navigator.geolocation.getCurrentPosition(async pos => {
    const {latitude:lat, longitude:lng} = pos.coords;
    let city = '';
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const d = await r.json();
      city = d.address?.city||d.address?.town||d.address?.village||d.address?.county||'';
    } catch {}
    userLocation = {lat,lng,city};
    cb(userLocation);
  }, () => showToast('Could not get location','error'), {timeout:8000});
}

// ═══════════════════════════════════════════════════════════
// EVENT DETAIL
// ═══════════════════════════════════════════════════════════
function viewDetail(ev) {
  selectedEvent = ev; currentQty = 1;
  document.title = `${ev.name} — Christ Link`;
  const isPaid  = ev.is_paid;
  const bg = BG_GRADIENTS[Math.abs((ev.name||'').charCodeAt(0)) % BG_GRADIENTS.length];
  const detailHero = document.getElementById('detailHero');
  if (ev.cover_url) {
    const safeUrl = ev.cover_url.replace(/\\/g,'').replace(/"/g,'%22');
    detailHero.style.cssText = `background:url("${safeUrl}") center/cover no-repeat;`;
    document.getElementById('detailEmoji').style.display = 'none';
    detailHero.classList.add('has-photo');
    detailHero.onclick = () => openLightbox(ev.cover_url);
  } else {
    detailHero.style.cssText = `background:${bg};`;
    document.getElementById('detailEmoji').style.display = 'block';
    document.getElementById('detailEmoji').innerHTML = ev.emoji ? `<span style="font-size:52px">${ev.emoji}</span>` : '<svg width="52" height="52" viewBox="0 0 32 32" fill="none"><rect x="14" y="4" width="4" height="24" rx="1.5" fill="#C9A84C"/><rect x="6" y="11" width="20" height="4" rx="1.5" fill="#C9A84C"/></svg>';
    detailHero.classList.remove('has-photo');
    detailHero.onclick = null;
  }
  document.getElementById('detailTitle').textContent = ev.name || 'Event';
  document.getElementById('detailHostName').textContent = ev.host_name || 'Community Host';
  const dhAv = document.getElementById('detailHostAv');
  dhAv.innerHTML = '';
  if (ev.host_avatar) {
    const img = document.createElement('img');
    img.src = ev.host_avatar;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%';
    dhAv.appendChild(img);
  } else {
    dhAv.textContent = (ev.host_name||'H').charAt(0).toUpperCase();
    if (ev.host_avatar_color) dhAv.style.background = ev.host_avatar_color;
  }
  // Host credibility bar — reset then async fetch
  const detailHostSub = document.getElementById('detailHostSub');
  const detailHostVerified = document.getElementById('detailHostVerified');
  detailHostSub.textContent = 'Hosted by';
  detailHostVerified.style.display = 'none';
  if (ev.host_id) {
    fetch(`/api/profiles/${ev.host_id}/stats`)
      .then(r => r.ok ? r.json() : null)
      .then(stats => {
        if (!stats) return;
        const parts = [];
        if (stats.eventsHosted > 0) parts.push(`${stats.eventsHosted} event${stats.eventsHosted !== 1 ? 's' : ''}`);
        if (stats.totalAttendees > 0) parts.push(`${stats.totalAttendees.toLocaleString()} attendees`);
        detailHostSub.textContent = parts.length ? parts.join(' · ') : 'Hosted by';
        if (stats.isVerified) detailHostVerified.style.display = 'inline';
      }).catch(() => {});
  }
  // Only show forum section if host has explicitly enabled it
  const forumSection = document.getElementById('detailForumSection');
  if (ev.forum_enabled) {
    forumSection.style.display = 'block';
    document.getElementById('detailForumCount').textContent = 'Loading…';
    loadForumCount(ev.id);
  } else {
    forumSection.style.display = 'none';
  }
  document.getElementById('detailDesc').textContent = ev.description || 'No description provided.';

  // Gallery section
  const gallerySection = document.getElementById('detailGallery');
  const galleryGrid    = document.getElementById('detailGalleryGrid');
  const urls = Array.isArray(ev.gallery_urls) ? ev.gallery_urls.filter(Boolean) : [];
  if (urls.length) {
    galleryGrid.innerHTML = '';
    urls.forEach(url => {
      const thumb = document.createElement('div');
      thumb.className = 'detail-gallery-thumb';
      thumb.onclick = () => openLightbox(url);
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Event photo';
      img.loading = 'lazy';
      thumb.appendChild(img);
      galleryGrid.appendChild(thumb);
    });
    gallerySection.style.display = 'block';
  } else {
    gallerySection.style.display = 'none';
  }
  document.getElementById('detailDate').textContent = ev.start_date
    ? new Date(ev.start_date).toLocaleString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'})
    : 'Date TBD';
  // Calendar add-to links
  const calRow = document.getElementById('detailCalendarRow');
  if (calRow) {
    if (ev.start_date) {
      const cs = new Date(ev.start_date);
      const ce = ev.end_date ? new Date(ev.end_date) : new Date(cs.getTime() + 7200000);
      const calFmt = d => d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
      const calLoc = encodeURIComponent([ev.venue_name,ev.address,ev.city,ev.state].filter(Boolean).join(', '));
      const gUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.name||'Event')}&dates=${calFmt(cs)}/${calFmt(ce)}&details=${encodeURIComponent(ev.description||'')}&location=${calLoc}`;
      const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nDTSTART:${calFmt(cs)}\r\nDTEND:${calFmt(ce)}\r\nSUMMARY:${(ev.name||'Event').replace(/[,;\\]/g,'\\$&')}\r\nLOCATION:${[ev.venue_name,ev.address,ev.city,ev.state].filter(Boolean).join(', ').replace(/[,;\\]/g,'\\$&')}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
      const icsUrl = URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));
      setTimeout(() => URL.revokeObjectURL(icsUrl), 60000);
      calRow.innerHTML = `<a href="${gUrl}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:#4285F4;background:rgba(66,133,244,.1);border:1px solid rgba(66,133,244,.2);padding:5px 12px;border-radius:var(--r-full);text-decoration:none;white-space:nowrap"><svg width="11" height="11" viewBox="0 0 24 24" fill="#4285F4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>Google Calendar</a><a href="${icsUrl}" download="${(ev.name||'event').replace(/[^a-z0-9]/gi,'_')}.ics" style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:var(--text);background:var(--surface2);border:1px solid var(--border);padding:5px 12px;border-radius:var(--r-full);text-decoration:none;white-space:nowrap"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Apple Calendar</a>`;
      calRow.style.display = 'flex';
    } else { calRow.style.display = 'none'; }
  }
  const locText = ev.venue_name
    ? `${ev.venue_name}, ${ev.city||''}`
    : (ev.city || (ev.format==='online'?'Online':'TBD'));
  document.getElementById('detailLocation').textContent = locText;
  // Build full address string for maps links
  const fullAddr = [ev.venue_name, ev.address, ev.city, ev.state].filter(Boolean).join(', ');
  document.getElementById('detailLocationRow').dataset.addr = fullAddr || locText;
  document.getElementById('detailLocationRow').style.display = (ev.format === 'online') ? 'none' : '';
  // tags
  const tagsEl = document.getElementById('detailTags');
  tagsEl.innerHTML = '';
  if (ev.event_type) { const t=document.createElement('span');t.className='tag';t.textContent=ev.event_type;tagsEl.appendChild(t); }
  if (ev.format)     { const t=document.createElement('span');t.className='tag';t.textContent=ev.format==='in_person'?'In Person':ev.format;tagsEl.appendChild(t); }
  // price / ticket types / qty
  const ticketSection = document.getElementById('detailTicketSection');
  const priceBig = document.getElementById('detailPriceBig');
  const priceSub = document.getElementById('detailPriceSub');
  const rsvpBtn  = document.getElementById('detailRsvpBtn');
  selectedTicketTypeIdx = 0;
  if (isPaid && ev.ticket_types?.length) {
    renderTicketTypeSelector(ev.ticket_types);
    ticketSection.style.display = 'block';
    const lowest = ev.ticket_types.reduce((m, t) => t.price_cents < m.price_cents ? t : m, ev.ticket_types[0]);
    priceBig.textContent = `$${(lowest.price_cents/100).toFixed(2)}`;
    priceSub.textContent = ev.ticket_types.length > 1 ? 'Starting from' : 'Per person';
    rsvpBtn.textContent  = 'Get Tickets →';
  } else if (isPaid) {
    ticketSection.style.display = 'none';
    priceBig.textContent = 'Paid';
    priceSub.textContent = 'See event for pricing';
    rsvpBtn.textContent  = 'Get Tickets →';
  } else {
    ticketSection.style.display = 'none';
    priceBig.textContent = 'Free';
    priceSub.textContent = 'Open to all';
    rsvpBtn.textContent  = 'Reserve My Spot →';
  }
  rsvpBtn.classList.remove('confirmed');
  document.getElementById('detailCancelRsvpBtn').style.display = 'none';

  // Cutoff check — disable RSVP/Buy if sales window has closed
  const cutoffTime = ev.sales_cutoff || ev.end_date;
  const evEnded = new Date() > new Date(ev.end_date || ev.start_date || 8.64e15);
  if (evEnded || (cutoffTime && new Date() > new Date(cutoffTime))) {
    rsvpBtn.disabled = true;
    rsvpBtn.textContent = evEnded ? 'This event has ended' : 'Sales Closed';
    rsvpBtn.style.opacity = '0.5';
    rsvpBtn.style.cursor = 'not-allowed';
  } else {
    rsvpBtn.disabled = false;
    rsvpBtn.style.opacity = '';
    rsvpBtn.style.cursor = '';
  }

  // Who's Going — always load from API so paid ticket holders appear too
  // Start hidden; loadInlineAttendees will show it if there are attendees
  document.getElementById('detailWhoGoing').style.display = 'none';
  loadInlineAttendees(ev.id, ev.is_paid);

  // Check if current user has already RSVP'd — retry after delay in case auth is still loading
  function checkRsvpState() {
    if (!currentUser || ev.is_paid) return;
    fetch(`${API_BASE}/api/rsvp/${ev.id}`, {
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` }
    }).then(r => r.json()).then(data => {
      if (data.rsvp?.status === 'confirmed') {
        const btn = document.getElementById('detailRsvpBtn');
        if (btn && !btn.disabled && !btn.classList.contains('confirmed')) {
          btn.textContent = "You're Going!";
          btn.classList.add('confirmed');
          document.getElementById('detailCancelRsvpBtn').style.display = 'block';
        }
      }
    }).catch(() => {});
  }
  checkRsvpState();
  // Retry once after 800ms in case auth token wasn't ready yet
  setTimeout(checkRsvpState, 800);

  // Show invite button if current user is the host (retry for auth timing)
  function checkHostInviteBtn() {
    const inviteBtn = document.getElementById('detailInviteBtn');
    if (!inviteBtn) return;
    const isHost = currentUser?.id && ev.host_id && currentUser.id === ev.host_id;
    inviteBtn.style.display = isHost ? 'flex' : 'none';
  }
  checkHostInviteBtn();
  setTimeout(checkHostInviteBtn, 800);

  goTo('event-detail');
}

function changeQty(d) {
  const tt = selectedEvent?.ticket_types?.[selectedTicketTypeIdx] || selectedEvent?.ticket_types?.[0];
  const maxAvail = tt?.quantity != null ? Math.max(1, tt.quantity - (tt.sold || 0)) : 10;
  currentQty = Math.max(1, Math.min(Math.min(10, maxAvail), currentQty + d));
  document.getElementById('qtyVal').textContent = currentQty;
}

function handleRsvp() {
  if (!currentUser) { openAuth('signup', () => handleRsvp()); return; }
  if (selectedEvent?.is_paid) { openTicketSheet(); return; }
  const btn = document.getElementById('detailRsvpBtn');
  btn.disabled = true;
  fetch(`${API_BASE}/api/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
    body: JSON.stringify({ eventId: selectedEvent?.id }),
  }).then(async r => {
    btn.disabled = false;
    if (r.ok) {
      btn.textContent = "You're Going!";
      btn.classList.add('confirmed');
      document.getElementById('detailCancelRsvpBtn').style.display = 'block';
      // Update attendance count
      const countEl = document.getElementById('detailAttendanceCount');
      const cur = parseInt(countEl.textContent) || 0;
      const newRsvpCount = cur + 1;
      countEl.textContent = `${newRsvpCount} going`;
      document.getElementById('detailWhoGoingBtn').textContent = `See All ${newRsvpCount} Attendees ↓`;
      document.getElementById('detailWhoGoing').style.display = 'block';
      loadInlineAttendees(selectedEvent.id, selectedEvent.is_paid);
      // Keep home feed card count in sync
      if (selectedEvent) {
        selectedEvent.confirmed_rsvps = newRsvpCount;
        document.querySelectorAll(`.event-card[data-id="${selectedEvent.id}"] .card-going`).forEach(el => { el.textContent = `${newRsvpCount} going`; });
      }
      spawnConfetti();
      setTimeout(() => spawnConfetti(), 600);
      showSuccess('celebrate', 'You\'re Going!', `Spot reserved for ${selectedEvent?.name || 'the event'}. See you there!`);
    } else {
      const d = await r.json().catch(() => ({}));
      showToast(d.error || 'Could not RSVP', 'error');
    }
  }).catch(() => { btn.disabled = false; showToast('Could not RSVP', 'error'); });
}

async function cancelRsvp() {
  if (!selectedEvent) return;
  const btn = document.getElementById('detailCancelRsvpBtn');
  btn.disabled = true; btn.textContent = 'Cancelling…';
  try {
    const res = await fetch(`${API_BASE}/api/rsvp/${selectedEvent.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    if (res.ok) {
      const rsvpBtn = document.getElementById('detailRsvpBtn');
      rsvpBtn.textContent = 'Reserve My Spot →';
      rsvpBtn.classList.remove('confirmed');
      btn.style.display = 'none';
      // Update attendance count
      const countEl = document.getElementById('detailAttendanceCount');
      const cur = parseInt(countEl.textContent) || 1;
      const newCount = Math.max(0, cur - 1);
      countEl.textContent = `${newCount} going`;
      if (newCount === 0) {
        document.getElementById('detailWhoGoing').style.display = 'none';
      } else {
        document.getElementById('detailWhoGoingBtn').textContent = `See All ${newCount} Attendees ↓`;
        loadInlineAttendees(selectedEvent.id, selectedEvent.is_paid);
      }
      // Keep home feed card count in sync
      if (selectedEvent) {
        selectedEvent.confirmed_rsvps = newCount;
        document.querySelectorAll(`.event-card[data-id="${selectedEvent.id}"] .card-going`).forEach(el => { el.textContent = `${newCount} going`; });
      }
      showToast('RSVP cancelled');
    } else { showToast('Could not cancel RSVP', 'error'); }
  } catch { showToast('Could not cancel RSVP', 'error'); }
  finally { btn.disabled = false; btn.textContent = 'Cancel RSVP'; }
}

// ═══════════════════════════════════════════════════════════
// WHO'S GOING INLINE LOADER
// ═══════════════════════════════════════════════════════════
const AVATAR_COLORS_WG = ['#E05050','#4E7CFF','#4EC98C','#C9A84C','#A855F7','#F97316','#06B6D4','#EC4899'];

async function loadInlineAttendees(eventId, isPaid = false) {
  const avatarsEl  = document.getElementById('detailWhoGoingAvatars');
  const listEl     = document.getElementById('detailWhoGoingList');
  const whoGoingEl = document.getElementById('detailWhoGoing');
  const countEl    = document.getElementById('detailAttendanceCount');
  const seeAllBtn  = document.getElementById('detailWhoGoingBtn');
  if (!avatarsEl || !listEl) return;
  avatarsEl.innerHTML = '';
  listEl.innerHTML = '';
  try {
    const res = await fetch(`${API_BASE}/api/events/${eventId}/attendees`);
    const { attendees } = await res.json();
    if (!attendees || attendees.length === 0) {
      if (whoGoingEl) whoGoingEl.style.display = 'none';
      return;
    }

    // Show section + update count
    if (whoGoingEl) whoGoingEl.style.display = 'block';
    if (countEl) countEl.textContent = `${attendees.length} going`;
    if (seeAllBtn) seeAllBtn.textContent = `See All ${attendees.length} Attendees ↓`;

    const shown = attendees.slice(0, 5);
    const extra = attendees.length - shown.length;

    // Avatar bubbles row
    shown.forEach((p, i) => {
      const div = document.createElement('div');
      div.className = 'who-going-av-bubble';
      div.style.background = p.avatar_color || AVATAR_COLORS_WG[i % AVATAR_COLORS_WG.length];
      if (p.avatar_url) {
        div.innerHTML = `<img alt="" src="${p.avatar_url}" style="width:100%;height:100%;object-fit:cover">`;
      } else {
        div.textContent = (p.full_name || '?').charAt(0).toUpperCase();
      }
      avatarsEl.appendChild(div);
    });
    if (extra > 0) {
      const div = document.createElement('div');
      div.className = 'who-going-av-bubble who-going-av-more';
      div.textContent = `+${extra}`;
      avatarsEl.appendChild(div);
    }

    // If current user is in the attendees list, reflect that in the button
    if (currentUser) {
      const isGoing = attendees.some(a => a.id === currentUser.id);
      if (isGoing) {
        const rsvpBtn = document.getElementById('detailRsvpBtn');
        if (rsvpBtn && !rsvpBtn.classList.contains('confirmed')) {
          rsvpBtn.textContent = isPaid ? 'Tickets Purchased!' : "You're Going!";
          rsvpBtn.classList.add('confirmed');
          if (!isPaid) {
            const cancelBtn = document.getElementById('detailCancelRsvpBtn');
            if (cancelBtn) cancelBtn.style.display = 'block';
          }
        }
      }
    }

    // Attendee list rows
    const tag = isPaid ? 'Ticket' : "RSVP'd";
    shown.forEach((p, i) => {
      const row = document.createElement('div');
      row.className = 'who-going-row';
      row.onclick = () => openPublicProfile(p.id);
      const color   = p.avatar_color || AVATAR_COLORS_WG[i % AVATAR_COLORS_WG.length];
      const initial = (p.full_name || '?').charAt(0).toUpperCase();
      const parts   = (p.full_name || 'Anonymous').split(' ');
      const displayName = parts.length > 1 ? `${parts[0]} ${parts[1].charAt(0)}.` : parts[0];
      const avInner = p.avatar_url
        ? `<img alt="" src="${p.avatar_url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
        : initial;
      row.innerHTML = `
        <div class="who-going-row-av" style="background:${color}">${avInner}</div>
        <div class="who-going-row-info">
          <div class="who-going-row-name">${displayName}</div>
          <div class="who-going-row-tag">${tag}</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      `;
      listEl.appendChild(row);
    });
  } catch(e) {
    console.error('loadInlineAttendees error:', e);
  }
}

// ═══════════════════════════════════════════════════════════
// APPLE WALLET
// ═══════════════════════════════════════════════════════════
async function addToAppleWallet() {
  if (!currentSession?.access_token) { openAuth('signin'); return; }

  const btn  = document.getElementById('tvWalletBtn');
  const orig = btn.innerHTML;
  btn.innerHTML = '<div class="spinner" style="border-top-color:#fff;border-color:rgba(255,255,255,.2)"></div>';
  btn.disabled  = true;

  if (!currentViewedTicketId) {
    showToast('No ticket selected', 'error');
    btn.innerHTML = orig; btn.disabled = false;
    return;
  }

  try {
    const passRes = await fetch(`${API_BASE}/api/tickets/${currentViewedTicketId}/wallet`, {
      headers: { 'Authorization': `Bearer ${currentSession.access_token}` }
    });

    if (!passRes.ok) {
      const err = await passRes.json();
      throw new Error(err.error || 'Failed to generate pass');
    }

    const blob = await passRes.blob();
    const url  = URL.createObjectURL(blob);
    window.location.href = url;
    setTimeout(() => URL.revokeObjectURL(url), 5000);

  } catch(e) {
    console.error('Wallet error:', e);
    showToast(e.message || 'Could not generate pass', 'error');
  }

  btn.innerHTML = orig;
  btn.disabled  = false;
}

// ═══════════════════════════════════════════════════════════
// ATTENDEES / MINI PROFILE
// ═══════════════════════════════════════════════════════════
async function openAttendeesSheet() {
  openSheet('attendeesSheet');
  const loading = document.getElementById('attendeesLoading');
  const list    = document.getElementById('attendeesList');
  loading.style.display = 'block';
  list.innerHTML = '';
  try {
    const res = await fetch(`${API_BASE}/api/events/${selectedEvent.id}/attendees`);
    const { attendees } = await res.json();
    loading.style.display = 'none';
    if (!attendees || attendees.length === 0) {
      list.innerHTML = '<div style="text-align:center;padding:32px;color:var(--muted);font-size:14px">No one has signed up yet — be the first!</div>';
      return;
    }
    attendees.forEach(p => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);cursor:pointer';
      row.onclick = () => openPublicProfile(p.id);
      // avatar
      const av = document.createElement('div');
      av.style.cssText = 'width:44px;height:44px;border-radius:50%;flex-shrink:0;overflow:hidden;background:' + (p.avatar_color || 'linear-gradient(135deg,#C9A84C,#6B4A00)') + ';display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:700;color:#0A0A0F';
      if (p.avatar_url) {
        const img = document.createElement('img');
        img.src = p.avatar_url;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover';
        av.appendChild(img);
      } else {
        av.textContent = (p.full_name || '?').charAt(0).toUpperCase();
      }
      const info = document.createElement('div');
      info.style.cssText = 'flex:1;min-width:0';
      info.innerHTML = '<div style="font-size:14px;font-weight:600;color:var(--text)">' + (p.full_name || 'ChristLink Member') + '</div>' +
        (p.city ? '<div style="font-size:12px;color:var(--muted)">' + p.city + '</div>' : '');
      const arrow = document.createElement('div');
      arrow.style.cssText = 'font-size:16px;color:var(--muted)';
      arrow.textContent = '›';
      row.appendChild(av); row.appendChild(info); row.appendChild(arrow);
      list.appendChild(row);
    });
  } catch {
    loading.textContent = 'Could not load attendees.';
  }
}

function openMiniProfile(p) {
  // avatar
  const avEl = document.getElementById('miniProfAv');
  avEl.innerHTML = '';
  if (p.avatar_url) {
    const img = document.createElement('img');
    img.src = p.avatar_url;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover';
    avEl.appendChild(img);
    avEl.style.background = 'transparent';
  } else {
    avEl.textContent = (p.full_name || '?').charAt(0).toUpperCase();
    avEl.style.background = p.avatar_color || 'linear-gradient(135deg,#C9A84C,#6B4A00)';
  }
  document.getElementById('miniProfName').textContent = p.full_name || 'ChristLink Member';
  document.getElementById('miniProfCity').textContent = p.city || '';
  document.getElementById('miniProfBio').textContent  = p.bio  || '';
  // social links
  const social = document.getElementById('miniProfSocial');
  social.innerHTML = '';
  const links = [
    { url: p.instagram_url, label: 'Instagram', color: '#E1306C' },
    { url: p.facebook_url,  label: 'Facebook',  color: '#1877F2' },
    { url: p.tiktok_url,    label: 'TikTok',    color: '#fff'    },
  ];
  links.forEach(({ url, label, color }) => {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url.startsWith('http') ? url : 'https://' + url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.style.cssText = 'display:flex;align-items:center;gap:8px;padding:10px 14px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-md);text-decoration:none';
    a.innerHTML = '<span style="font-size:13px;font-weight:600;color:' + color + '">' + label + '</span><span style="font-size:12px;color:var(--muted);margin-left:auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px">' + url + '</span>';
    social.appendChild(a);
  });
  openSheet('miniProfileSheet');
}

// ═══════════════════════════════════════════════════════════
// TICKET PURCHASE
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// TICKET TYPE SELECTOR
// ═══════════════════════════════════════════════════════════
function renderTicketTypeSelector(ticketTypes) {
  selectedTicketTypeIdx = 0;
  const list = document.getElementById('detailTicketList');
  list.innerHTML = '';
  ticketTypes.forEach((tt, i) => {
    const remaining = tt.quantity != null ? tt.quantity - (tt.sold || 0) : null;
    const soldOut   = remaining !== null && remaining <= 0;
    const row = document.createElement('div');
    row.className = 'ticket-select-row' + (i === 0 ? ' selected' : '') + (soldOut ? ' sold-out' : '');
    row.id = `ttSelectRow-${i}`;
    if (!soldOut) row.onclick = () => selectTicketType(i);
    const availText = soldOut ? 'Sold out' : (remaining !== null ? `${remaining} remaining` : 'Available');
    row.innerHTML = `
      <div class="ticket-select-radio"></div>
      <div style="flex:1;min-width:0">
        <div class="ticket-select-name">${escapeHtml(tt.name || 'General Admission')}</div>
        <div class="ticket-select-avail">${availText}</div>
      </div>
      <div class="ticket-select-price">${soldOut ? '—' : `$${(tt.price_cents/100).toFixed(2)}`}</div>`;
    list.appendChild(row);
  });
  // Auto-select first non-sold-out type
  const firstAvail = ticketTypes.findIndex(tt => tt.quantity == null || (tt.quantity - (tt.sold||0)) > 0);
  if (firstAvail > 0) selectTicketType(firstAvail);
  else updateQtyForSelectedTicket();
}

function selectTicketType(idx) {
  selectedTicketTypeIdx = idx;
  document.querySelectorAll('.ticket-select-row').forEach((row, i) => {
    row.classList.toggle('selected', i === idx);
  });
  updateQtyForSelectedTicket();
}

function updateQtyForSelectedTicket() {
  if (!selectedEvent?.ticket_types?.length) return;
  const tt = selectedEvent.ticket_types[selectedTicketTypeIdx];
  if (!tt) return;
  currentQty = 1;
  document.getElementById('qtyVal').textContent = '1';
  document.getElementById('qtyPriceNote').textContent = `$${(tt.price_cents/100).toFixed(2)} each`;
  document.getElementById('detailQtyRow').style.display = 'block';
  document.getElementById('detailPriceBig').textContent = `$${(tt.price_cents/100).toFixed(2)}`;
  document.getElementById('detailPriceSub').textContent = 'Per person';
}

function openTicketSheet() {
  if (!selectedEvent) return;
  const tt = selectedEvent.ticket_types?.[selectedTicketTypeIdx] ?? selectedEvent.ticket_types?.[0];
  const face = tt ? tt.price_cents * currentQty : 0;
  const pf   = Math.round(face * 0.07);
  const absorbFee = selectedEvent.absorb_stripe_fee !== false;
  const initialTotal = face + pf; // face + 7% platform fee (approximate until server responds)
  document.getElementById('ticketSheetTitle').textContent = selectedEvent.name;
  document.getElementById('ticketSheetSub').textContent   = `${currentQty} ticket${currentQty>1?'s':''} · ${currentUser?.email||''}`;
  document.getElementById('bdFace').textContent = `$${(face/100).toFixed(2)}`;
  document.getElementById('bdPf').textContent   = `$${(pf/100).toFixed(2)}`;
  document.getElementById('bdTotal').textContent = `$${(initialTotal/100).toFixed(2)}`;
  document.getElementById('payBtnAmt').textContent = `$${(initialTotal/100).toFixed(2)}`;
  document.getElementById('bdTaxRow').style.display = 'none';
  openSheet('ticketSheet');
  setTimeout(mountCard, 150);
  // fetch real breakdown
  if (tt) {
    Promise.all([
      fetch(`${API_BASE}/api/price-breakdown?price=${tt.price_cents}&qty=${currentQty}&absorb=${absorbFee}`),
      fetch(`${API_BASE}/api/tax-estimate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amountCents:face})})
    ]).then(async ([r1,r2]) => {
      const bd  = await r1.json();
      const tax = await r2.json();
      document.getElementById('bdFace').textContent  = `$${(bd.face/100).toFixed(2)}`;
      document.getElementById('bdPf').textContent    = `$${(bd.platformFee/100).toFixed(2)}`;
      if (tax.taxAmountCents > 0) {
        document.getElementById('bdTaxRow').style.display = 'flex';
        document.getElementById('bdTax').textContent = `$${(tax.taxAmountCents/100).toFixed(2)}`;
        const total = bd.chargeAmount + tax.taxAmountCents;
        document.getElementById('bdTotal').textContent   = `$${(total/100).toFixed(2)}`;
        document.getElementById('payBtnAmt').textContent = `$${(total/100).toFixed(2)}`;
      } else {
        document.getElementById('bdTotal').textContent   = `$${(bd.chargeAmount/100).toFixed(2)}`;
        document.getElementById('payBtnAmt').textContent = `$${(bd.chargeAmount/100).toFixed(2)}`;
      }
    }).catch(()=>{});
  }
}

function mountCard() {
  if (cardEl) return;
  cardEl = stripeElements.create('card',{
    style:{base:{color:'#F0EBE0',fontFamily:'DM Sans,sans-serif',fontSize:'15px','::placeholder':{color:'#666070'}}}
  });
  cardEl.mount('#cardEl');
  cardEl.on('focus',()=>document.getElementById('cardWrap').classList.add('focused'));
  cardEl.on('blur', ()=>document.getElementById('cardWrap').classList.remove('focused'));
  cardEl.on('change',e=>{
    const err = document.getElementById('cardErr');
    if(e.error){err.textContent=e.error.message;err.classList.add('show');}
    else{err.textContent='';err.classList.remove('show');}
  });
}

async function processPayment() {
  if (!cardEl || !selectedEvent) return;
  const btn = document.getElementById('payBtn');
  const orig = btn.innerHTML;
  btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>&nbsp;Processing…';
  const err = document.getElementById('cardErr');
  try {
    const res = await fetch(`${API_BASE}/api/create-payment-intent`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${currentSession?.access_token}`,
      },
      body: JSON.stringify({
        eventId:      selectedEvent.id,
        ticketTypeId: (selectedEvent.ticket_types?.[selectedTicketTypeIdx] ?? selectedEvent.ticket_types?.[0])?.id,
        qty:          currentQty,
        buyerEmail:   currentUser?.email,
        couponCode: _appliedCoupon ? document.getElementById('couponInput')?.value.trim() : null,
      }),
    });

    const piData = await res.json();
    // Surface server error message directly to user
    if (!res.ok || piData.error) {
      throw new Error(piData.error || `Server error ${res.status}. Please try again.`);
    }

    const { clientSecret, ticketCode, free: isFree } = piData;

    // ── FREE ticket path (coupon brought total to $0) ──────────────
    if (isFree) {
      closeSheet('ticketSheet');
      spawnConfetti();
      const codeDisplay = ticketCode ? ` · Code: ${ticketCode}` : '';
      showSuccess('ticket','Tickets Confirmed!',`${currentQty} ticket${currentQty>1?'s':''} to ${selectedEvent.name}${codeDisplay}.`);
      document.getElementById('detailRsvpBtn').textContent = 'Tickets Purchased!';
      document.getElementById('detailRsvpBtn').classList.add('confirmed');
      document.getElementById('detailCancelRsvpBtn').style.display = 'none';
      // Update remaining count immediately
      if (selectedEvent?.ticket_types?.[selectedTicketTypeIdx]) {
        selectedEvent.ticket_types[selectedTicketTypeIdx].sold =
          (selectedEvent.ticket_types[selectedTicketTypeIdx].sold || 0) + currentQty;
        renderTicketTypeSelector(selectedEvent.ticket_types);
      }
      fetchMyTickets();
      const whoGoingEl = document.getElementById('detailWhoGoing');
      const countEl    = document.getElementById('detailAttendanceCount');
      const curCount   = parseInt(countEl?.textContent) || 0;
      const newCount   = curCount + currentQty;
      if (countEl) countEl.textContent = `${newCount} going`;
      const seeAllBtn = document.getElementById('detailWhoGoingBtn');
      if (seeAllBtn) seeAllBtn.textContent = `See All ${newCount} Attendees ↓`;
      if (whoGoingEl) whoGoingEl.style.display = 'block';
      setTimeout(() => loadInlineAttendees(selectedEvent.id, selectedEvent.is_paid), 1000);
      return;
    }

    // ── PAID ticket path ───────────────────────────────────────────
    if (!clientSecret) throw new Error('Payment setup failed — no client secret returned.');
    const {error, paymentIntent} = await stripeClient.confirmCardPayment(clientSecret,{
      payment_method:{card:cardEl,billing_details:{email:currentUser?.email}}
    });
    if (error) throw new Error(error.message);
    if (paymentIntent.status === 'succeeded') {
      // Immediately confirm ticket via fallback route (don't wait for webhook)
      try {
        await fetch(`${API_BASE}/api/tickets/confirm-by-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });
      } catch(e) { console.warn('[confirm fallback]', e.message); }
      closeSheet('ticketSheet');
      spawnConfetti();
      const codeDisplay = ticketCode ? ` · Code: ${ticketCode}` : '';
      showSuccess('ticket','Tickets Confirmed!',`${currentQty} ticket${currentQty>1?'s':''} to ${selectedEvent.name}${codeDisplay}. Receipt sent to ${currentUser?.email}.`);
      document.getElementById('detailRsvpBtn').textContent = 'Tickets Purchased!';
      document.getElementById('detailRsvpBtn').classList.add('confirmed');
      document.getElementById('detailCancelRsvpBtn').style.display = 'none';
      // Update remaining count immediately
      if (selectedEvent?.ticket_types?.[selectedTicketTypeIdx]) {
        selectedEvent.ticket_types[selectedTicketTypeIdx].sold =
          (selectedEvent.ticket_types[selectedTicketTypeIdx].sold || 0) + currentQty;
        renderTicketTypeSelector(selectedEvent.ticket_types);
      }
      // Refresh profile ticket count + list immediately
      fetchMyTickets();
      // Re-fetch after 2.5s to catch webhook-confirmed status
      setTimeout(fetchMyTickets, 2500);
      // Update Who's Going section
      const whoGoingEl = document.getElementById('detailWhoGoing');
      const countEl    = document.getElementById('detailAttendanceCount');
      const curCount   = parseInt(countEl?.textContent) || 0;
      const newCount   = curCount + currentQty;
      if (countEl) countEl.textContent = `${newCount} going`;
      const seeAllBtn = document.getElementById('detailWhoGoingBtn');
      if (seeAllBtn) seeAllBtn.textContent = `See All ${newCount} Attendees ↓`;
      if (whoGoingEl) whoGoingEl.style.display = 'block';
      // Reload inline attendees to show new buyer
      setTimeout(() => loadInlineAttendees(selectedEvent.id, selectedEvent.is_paid), 1000);
    }
  } catch(e) {
    // Show actual error — don't silently fake success
    if (err) { err.textContent = e.message || 'Payment failed. Please try again.'; err.classList.add('show'); }
    else showToast(e.message || 'Payment failed. Please try again.', 'error');
    btn.disabled = false; btn.innerHTML = orig;
    return;
  }
  btn.disabled=false; btn.innerHTML=orig;
}

// ─── LISTING FEE ─────────────────────────────────────────────
let lfMounted = false;
function resetListingCard() {
  listingFeePaid = false;
  listingFeePaymentMethodId = null;
  listingFeeHostEmail = null;
  listingFeePromoCode = null;
  _listingPromoId = null;
  _listingPromoDiscount = 0;
  const promoInp = document.getElementById('lfPromoInput'); if (promoInp) promoInp.value = '';
  const promoMsg = document.getElementById('lfPromoMsg'); if (promoMsg) promoMsg.style.display = 'none';
  const payBtn = document.getElementById('lfPayBtn'); if (payBtn) payBtn.textContent = 'Pay $19.99 →';
  lfMounted = false;
  lfCardNum = lfCardExp = lfCardCvc = null;
  ['lfCardNumberEl','lfCardExpiryEl','lfCardCvcEl'].forEach(id => {
    const el = document.getElementById(id); if (el) el.innerHTML = '';
  });
}
function mountListingCard() {
  if (lfMounted) return; lfMounted = true;
  const elems = stripeClient.elements({appearance:{theme:'night',variables:{colorPrimary:'#C9A84C',colorBackground:'#1E1E2A',colorText:'#F0EBE0',fontFamily:'DM Sans,sans-serif',borderRadius:'8px'}}});
  const st = {base:{color:'#F0EBE0',fontFamily:'DM Sans,sans-serif',fontSize:'15px','::placeholder':{color:'#666070'}},invalid:{color:'#E05050'}};
  lfCardNum = elems.create('cardNumber',{style:st,showIcon:true});
  lfCardExp = elems.create('cardExpiry',{style:st});
  lfCardCvc = elems.create('cardCvc',  {style:st});
  lfCardNum.mount('#lfCardNumberEl');
  lfCardExp.mount('#lfCardExpiryEl');
  lfCardCvc.mount('#lfCardCvcEl');
  [{el:lfCardNum,wrap:'lfCardWrap'},{el:lfCardExp,wrap:'lfExpWrap'},{el:lfCardCvc,wrap:'lfCvcWrap'}].forEach(({el,wrap})=>{
    el.on('focus',()=>document.getElementById(wrap).classList.add('focused'));
    el.on('blur', ()=>document.getElementById(wrap).classList.remove('focused'));
    el.on('change',e=>{
      const err=document.getElementById('lfErr');
      if(e.error){err.textContent=e.error.message;err.classList.add('show');}
      else{err.textContent='';err.classList.remove('show');}
    });
  });
}

document.getElementById('listingFeeSheet').addEventListener('click', e => {
  // mount when sheet first interacted with
  if (!lfMounted) setTimeout(mountListingCard, 100);
}, {once:true});

function openSheet(id) {
  document.getElementById(id).classList.add('open');
  // iOS requires position:fixed + overflow:hidden to truly lock body scroll
  document.body.dataset.scrollY = window.scrollY;
  document.body.style.overflow  = 'hidden';
  document.body.style.position  = 'fixed';
  document.body.style.width     = '100%';
  if (id === 'listingFeeSheet') setTimeout(mountListingCard, 200);
}

async function processListingFee() {
  const btn  = document.getElementById('lfPayBtn');
  const orig = btn.innerHTML;
  const err  = document.getElementById('lfErr');
  const promoCode = document.getElementById('lfPromoInput').value.trim().toUpperCase() || null;
  err.classList.remove('show');

  // If promo makes it free, skip Stripe card entry entirely
  if (_listingPromoId && _listingPromoDiscount >= (HOST_LISTING_FEE_CENTS || 1999)) {
    listingFeePaymentMethodId = '__promo_free__';
    listingFeeHostEmail = document.getElementById('lfEmail').value.trim();
    listingFeePromoCode = promoCode;
    handleListingFeePaid();
    return;
  }

  if (!lfCardNum) { showToast('Card form loading…'); return; }
  const name = document.getElementById('lfName').value.trim();
  const email= document.getElementById('lfEmail').value.trim();
  if (!name) { err.textContent='Name on card is required.';err.classList.add('show'); return; }
  btn.disabled=true; btn.innerHTML='<div class="spinner"></div>&nbsp;Saving card…';
  try {
    const {paymentMethod, error:pmErr} = await stripeClient.createPaymentMethod({type:'card',card:lfCardNum,billing_details:{name,email:email||undefined}});
    if (pmErr) throw new Error(pmErr.message);
    listingFeePaymentMethodId = paymentMethod.id;
    listingFeeHostEmail = email;
    listingFeePromoCode = promoCode;
    handleListingFeePaid();
  } catch(e) {
    err.textContent=e.message; err.classList.add('show'); btn.disabled=false; btn.innerHTML=orig;
  }
}

function handleListingFeePaid() {
  listingFeePaid = true;
  closeSheet('listingFeeSheet');
  document.getElementById('listingStatus').style.display = 'block';
  document.getElementById('payFeeBtn').style.display     = 'none';
  showToast('Card saved — $19.99 charged when you publish','success');
  spawnConfetti();
  // If user came from the type selector paywall, auto-proceed into the paid event form
  if (_pendingPaidEventStart) {
    _pendingPaidEventStart = false;
    setTimeout(() => selectEventType(true), 400); // small delay so sheet close animates first
  }
}

// ═══════════════════════════════════════════════════════════
// ADDRESS AUTOCOMPLETE (Photon / OpenStreetMap — free, no API key)
// ═══════════════════════════════════════════════════════════
let addrDebounce = null;

async function addrAutocomplete(val) {
  const drop = document.getElementById('addrDropdown');
  if (!drop) return;
  clearTimeout(addrDebounce);
  if (!val || val.length < 3) { drop.style.display = 'none'; return; }
  addrDebounce = setTimeout(async () => {
    try {
      const res  = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(val)}&lang=en&limit=6`);
      const data = await res.json();
      const features = (data.features || []).filter(f => f.properties?.country === 'United States' || f.properties?.countrycode === 'US');
      if (!features.length) { drop.style.display = 'none'; return; }
      drop.innerHTML = '';
      features.forEach(f => {
        const p    = f.properties;
        const street  = [p.housenumber, p.street].filter(Boolean).join(' ');
        const city    = p.city || p.town || p.village || p.county || '';
        const state   = p.state || '';
        const display = [street, city, state].filter(Boolean).join(', ');
        if (!display) return;
        const item = document.createElement('div');
        item.style.cssText = 'padding:11px 14px;font-size:14px;cursor:pointer;border-bottom:1px solid var(--border);color:var(--text)';
        item.textContent = display;
        item.onmouseenter = () => item.style.background = 'var(--surface3)';
        item.onmouseleave = () => item.style.background = '';
        item.onmousedown  = () => {
          if (street)  document.getElementById('evAddress').value = street;
          if (city)    document.getElementById('evCity').value    = city;
          if (state) {
            const stateInput = document.getElementById('evState');
            // Convert full state name to 2-letter abbreviation
            const abbr = STATE_ABBR[state] || state.slice(0,2).toUpperCase();
            if (stateInput) stateInput.value = abbr;
          }
          drop.style.display = 'none';
          updateReview();
        };
        drop.appendChild(item);
      });
      drop.style.display = features.length ? 'block' : 'none';
    } catch { drop.style.display = 'none'; }
  }, 320);
}

function closeAddrDropdown() {
  const drop = document.getElementById('addrDropdown');
  if (drop) drop.style.display = 'none';
}

// ═══════════════════════════════════════════════════════════
// MAPS CHOICE
// ═══════════════════════════════════════════════════════════
function openMapsChoice() {
  const row  = document.getElementById('detailLocationRow');
  const addr = row?.dataset?.addr || '';
  if (!addr || addr === 'Online' || addr === 'TBD') return;
  const encoded = encodeURIComponent(addr);
  document.getElementById('mapsAddress').textContent = addr;
  document.getElementById('mapsAppleBtn').href  = `maps://maps.apple.com/?q=${encoded}`;
  document.getElementById('mapsGoogleBtn').href = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  openSheet('mapsSheet');
}

function copyAddress() {
  const addr = document.getElementById('mapsAddress')?.textContent || '';
  if (!addr) return;
  navigator.clipboard.writeText(addr).then(() => {
    showToast('Address copied!', 'success');
    closeSheet('mapsSheet');
  }).catch(() => showToast('Could not copy — try manually', 'error'));
}

const STATE_ABBR = {
  'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
  'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
  'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS',
  'Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA',
  'Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT',
  'Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM',
  'New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK',
  'Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD',
  'Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT','Virginia':'VA','Washington':'WA',
  'West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY','District of Columbia':'DC',
};

// ═══════════════════════════════════════════════════════════
// COVER PHOTO + GALLERY HANDLERS
// ═══════════════════════════════════════════════════════════
function handleCoverPhoto(input) {
  const file = input.files[0]; if (!file) return;
  coverPhotoFile = file;
  const r = new FileReader();
  r.onload = e => {
    const srcImg = new Image();
    srcImg.onload = () => {
      const MAX = 1200;
      const scale = Math.min(1, MAX / Math.max(srcImg.width, srcImg.height));
      const canvas = document.createElement('canvas');
      canvas.width  = Math.round(srcImg.width  * scale);
      canvas.height = Math.round(srcImg.height * scale);
      canvas.getContext('2d').drawImage(srcImg, 0, 0, canvas.width, canvas.height);
      coverPhotoB64 = canvas.toDataURL('image/jpeg', 0.82);
      const preview     = document.getElementById('coverPhotoPreview');
      const placeholder = document.getElementById('coverPhotoPlaceholder');
      const change      = document.getElementById('coverPhotoChange');
      preview.src = coverPhotoB64;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
      change.style.display = 'block';
    };
    srcImg.src = e.target.result;
  };
  r.readAsDataURL(file);
}

function handleGalleryPhotos(input) {
  const files = [...input.files]; if (!files.length) return;
  const remaining = 6 - galleryFiles.length;
  if (remaining <= 0) { showToast('Maximum 6 gallery photos','error'); return; }
  const toAdd = files.slice(0, remaining);
  toAdd.forEach(file => {
    if (file.size > 5 * 1024 * 1024) { showToast(`${file.name} is over 5MB — skipped`,'error'); return; }
    galleryFiles.push(file);
    const r = new FileReader();
    r.onload = e => renderGalleryThumb(e.target.result, galleryFiles.length - 1);
    r.readAsDataURL(file);
  });
  if (galleryFiles.length >= 6) document.getElementById('galleryAddBtn').style.opacity = '0.4';
}

function renderGalleryThumb(src, idx) {
  const grid = document.getElementById('galleryGrid');
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:relative;aspect-ratio:1;border-radius:var(--r-sm);overflow:hidden;background:var(--surface3)';
  wrap.innerHTML = `
    <img alt="" src="${src}" style="width:100%;height:100%;object-fit:cover">
    <button aria-label="Remove photo" onclick="removeGalleryPhoto(${idx},this.parentElement)" style="position:absolute;top:4px;right:4px;width:22px;height:22px;border-radius:50%;background:rgba(0,0,0,.7);color:#fff;font-size:13px;display:flex;align-items:center;justify-content:center;border:none">×</button>`;
  grid.appendChild(wrap);
}

function removeGalleryPhoto(idx, el) {
  galleryFiles.splice(idx, 1);
  el.remove();
  document.getElementById('galleryAddBtn').style.opacity = '1';
  // re-index remaining buttons
  document.querySelectorAll('#galleryGrid button').forEach((btn, i) => {
    btn.setAttribute('onclick', `removeGalleryPhoto(${i},this.parentElement)`);
  });
}

// ═══════════════════════════════════════════════════════════
// HOST FORM
// ═══════════════════════════════════════════════════════════
function setHostStep(n) {
  document.querySelectorAll('.form-step').forEach(s=>s.classList.remove('active'));
  document.getElementById(`host-step-${n}`).classList.add('active');
  for (let i=1;i<=4;i++) {
    const num  = document.getElementById(`si-${i}`);
    const lbl  = document.getElementById(`sl-${i}`);
    num.classList.remove('active','done');
    lbl.classList.remove('active');
    if (i<n)  {num.classList.add('done'); num.innerHTML='<svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';}
    else       num.textContent = i;
    if (i===n) {num.classList.add('active'); lbl.classList.add('active');}
    if (i<=3) document.getElementById(`line-${i}-${i+1}`).classList.toggle('done',i<n);
  }
  if (n===4) buildReview();
  window.scrollTo({top:0,behavior:'smooth'});
}

function hostNext(from) {
  if (!currentUser) { openAuth('signup', ()=>hostNext(from)); return; }
  if (from===1) {
    const isPaid = document.getElementById('paidToggle').checked;
    if (isPaid && !listingFeePaid) {
      showToast('Pay listing fee to continue');
      document.getElementById('listingFeeSection').scrollIntoView({behavior:'smooth',block:'center'});
      return;
    }
  }
  setHostStep(from+1);
}
function hostPrev(from) { setHostStep(from-1); }

let _pendingPaidEventStart = false; // set true when paywall opened from type selector

function selectEventType(isPaid) {
  // Auth gate — require login before any hosting
  if (!currentUser) { openAuth('signup', () => selectEventType(isPaid)); return; }
  // Paywall gate — open listing fee sheet immediately for paid events
  if (isPaid && !listingFeePaid) {
    _pendingPaidEventStart = true;
    openSheet('listingFeeSheet');
    return;
  }
  // Proceed into the form
  _pendingPaidEventStart = false;
  document.getElementById('hostTypeSelect').style.display = 'none';
  document.getElementById('hostStepIndicators').style.display = '';
  document.getElementById('hostFormWrap').style.display = '';
  // Set paid state
  const paidToggle = document.getElementById('paidToggle');
  if (paidToggle) paidToggle.checked = isPaid;
  handlePaidToggle();
}

function handlePaidToggle() {
  const isPaid = document.getElementById('paidToggle')?.checked || false;
  const freeSetup    = document.getElementById('freeEventSetup');
  const paidSetup    = document.getElementById('paidEventSetup');
  const listingFee   = document.getElementById('listingFeeSection');
  const step3Label   = document.getElementById('step3Label');
  if (freeSetup)  freeSetup.style.display  = isPaid ? 'none'  : 'block';
  if (paidSetup)  paidSetup.style.display  = isPaid ? 'block' : 'none';
  if (listingFee) listingFee.style.display = isPaid ? 'block' : 'none';
  if (step3Label) step3Label.textContent   = isPaid ? 'Tickets' : 'Options';
  const sl3 = document.getElementById('sl-3'); if (sl3) sl3.textContent = isPaid ? 'Tickets' : 'Options';
}

// ─── TICKET ROWS ─────────────────────────────────────────────
function addTicketRow(first=false) {
  ticketRowCount++;
  const builder = document.getElementById('ticketBuilder');
  const row = document.createElement('div');
  row.className = 'ticket-row';
  row.id = `tr-${ticketRowCount}`;
  row.innerHTML = `
    <div>
      <div class="ticket-row-label">Name</div>
      <input type="text" placeholder="General Admission" value="${first?'General Admission':''}">
    </div>
    <div>
      <div class="ticket-row-label">Price ($)</div>
      <input type="number" value="${first?'25':''}" min="1" oninput="previewRevenue()">
    </div>
    <div>
      <div class="ticket-row-label">Qty</div>
      <input type="number" value="100" min="1">
    </div>
    <button class="remove-tt" aria-label="Remove ticket type" onclick="removeTicketRow(${ticketRowCount})" title="Remove"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>`;
  builder.appendChild(row);
  previewRevenue();
}
function removeTicketRow(id) {
  document.getElementById(`tr-${id}`)?.remove();
  previewRevenue();
}
function previewRevenue() {
  const input = document.querySelector('#ticketBuilder input[type=number]');
  const price = parseFloat(input?.value || 25);
  const pf   = price * 0.07;                      // added to attendee charge, not host's cost
  const base = price + pf;                         // what attendee pays
  const sf   = base * 0.029 + 0.30;               // Stripe fee on the full charge
  const net  = base - sf - pf;                     // host receives face minus Stripe fee
  document.getElementById('prevFace').textContent = `$${price.toFixed(2)}`;
  document.getElementById('prevPf').textContent   = `+$${pf.toFixed(2)}`;
  document.getElementById('prevSf').textContent   = `−$${sf.toFixed(2)}`;
  document.getElementById('prevNet').textContent  = `$${net.toFixed(2)}`;
}

function updateReview() { /* no-op until step 4 */ }

function buildReview() {
  const name  = document.getElementById('evName').value  || 'Untitled Event';
  const type  = document.getElementById('evType').value  || 'Event';
  const isPaid= document.getElementById('paidToggle').checked;
  const date  = document.getElementById('evStartDate').value;
  const city  = document.getElementById('evCity').value;
  const state = document.getElementById('evState').value;
  // cover photo
  const coverImg  = document.getElementById('reviewCoverImg');
  const coverPh   = document.getElementById('reviewCoverPlaceholder');
  if (coverPhotoB64) {
    coverImg.src = coverPhotoB64; coverImg.style.display = 'block'; coverPh.style.display = 'none';
  } else {
    coverImg.style.display = 'none'; coverPh.style.display = 'block';
  }
  document.getElementById('reviewName').textContent  = name;
  document.getElementById('reviewType').textContent  = type;
  document.getElementById('reviewMeta').textContent  = document.getElementById('evDesc').value?.substring(0,80) || '—';
  document.getElementById('reviewDate').textContent  = date ? new Date(date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}) : 'Date TBD';
  document.getElementById('reviewLocation').textContent = city ? `${city}${state?', '+state:''}` : 'Location TBD';
  document.getElementById('reviewPricing').textContent  = isPaid ? 'Paid · 7% platform fee' : 'Free · Instant RSVPs';
}

function selectPublishMode(mode) {
  publishMode = mode;
  // Update card selected states
  ['draft','scheduled','publish'].forEach(m => {
    const card  = document.getElementById(`popt-${m}`);
    const check = card?.querySelector('.publish-opt-check');
    if (m === mode) {
      card?.classList.add('selected');
      if (check) check.innerHTML = '<svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else {
      card?.classList.remove('selected');
      if (check) check.textContent = '';
    }
  });
  // Show/hide schedule datetime picker
  const picker = document.getElementById('schedulePickerWrap');
  if (picker) picker.classList.toggle('visible', mode === 'scheduled');
  // Update action button label
  const btn = document.getElementById('publishBtn');
  if (btn) {
    const labels = { draft: 'Save as Draft', scheduled: 'Schedule Event', publish: 'Publish Now' };
    btn.textContent = labels[mode];
  }
}

async function publishEvent() {
  if (!currentUser) { openAuth('signup'); return; }
  const btn = document.getElementById('publishBtn');
  const isDraft     = publishMode === 'draft';
  const isScheduled = publishMode === 'scheduled';
  // Validate schedule date before uploading anything
  let scheduleAt = null;
  if (isScheduled) {
    scheduleAt = document.getElementById('scheduleAt')?.value;
    if (!scheduleAt || new Date(scheduleAt) <= new Date()) {
      showToast('Please pick a future date and time to schedule', 'error');
      return;
    }
  }
  // Required-field validation (before uploading anything)
  {
    const v = id => (document.getElementById(id)?.value || '').trim();
    const fail = (step, id, msg) => { setHostStep(step); showToast(msg, 'error'); setTimeout(() => document.getElementById(id)?.focus(), 50); };
    if (!v('evName')) return fail(1, 'evName', 'Please enter an event name');
    if (!isDraft) {
      if (!v('evStartDate')) return fail(1, 'evStartDate', 'Please pick a start date and time');
      const fmt = document.getElementById('evFormat')?.value || 'in_person';
      if (fmt !== 'online' && !v('evCity')) return fail(2, 'evCity', 'Please enter the event location');
      if (fmt !== 'in_person' && !v('evOnlineUrl')) return fail(2, 'evOnlineUrl', 'Please add the online link');
      if (v('evEndDate') && new Date(v('evEndDate')) < new Date(v('evStartDate'))) return fail(1, 'evEndDate', 'End time must be after the start time');
    }
  }
  const spinnerLabels = { draft: 'Saving…', scheduled: 'Scheduling…', publish: 'Publishing…' };
  btn.disabled=true; btn.innerHTML=`<div class="spinner"></div>&nbsp;${spinnerLabels[publishMode]}`;
  const isPaid    = document.getElementById('paidToggle').checked;
  const name      = document.getElementById('evName').value.trim();
  const desc      = document.getElementById('evDesc').value.trim();
  const eventType = document.getElementById('evType').value;
  // Helper: upload image data URL via server (admin key, bypasses RLS)
  const uploadImgViaServer = async (dataUrl, type) => {
    const r = await fetch(`${API_BASE}/api/upload-event-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
      body: JSON.stringify({ dataUrl, type }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'Upload failed');
    return d.url;
  };
  // Compress a File to a data URL via canvas
  const compressFile = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        res(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = rej;
      img.src = e.target.result;
    };
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

  // Upload cover photo via server
  let coverUrl = null;
  if (coverPhotoFile) {
    btn.innerHTML = '<div class="spinner"></div>&nbsp;Uploading cover…';
    try {
      const dataUrl = coverPhotoB64 || await compressFile(coverPhotoFile);
      coverUrl = await uploadImgViaServer(dataUrl, 'cover');
    } catch (e) {
      btn.disabled = false; btn.innerHTML = 'Publish Event';
      showToast('Cover photo upload failed: ' + e.message, 'error'); return;
    }
  }
  // Upload gallery images via server
  const galleryUrls = [];
  if (galleryFiles.length) {
    btn.innerHTML = '<div class="spinner"></div>&nbsp;Uploading photos…';
    for (const file of galleryFiles) {
      try {
        const dataUrl = await compressFile(file);
        galleryUrls.push(await uploadImgViaServer(dataUrl, 'gallery'));
      } catch { /* skip failed gallery photos */ }
    }
  }
  const format    = document.getElementById('evFormat').value || 'in_person';
  const startDate = document.getElementById('evStartDate').value;
  const endDate   = document.getElementById('evEndDate').value;
  const venueName = document.getElementById('evVenue').value.trim();
  const address   = document.getElementById('evAddress').value.trim();
  const city      = document.getElementById('evCity').value.trim();
  const state     = document.getElementById('evState').value.trim();
  const capacity  = document.getElementById('evCapacity').value;
  const onlineUrl = document.getElementById('evOnlineUrl').value.trim();
  if (!name) {
    showToast('Please add an event name','error');
    btn.disabled=false; btn.textContent = { draft:'Save as Draft', scheduled:'Schedule Event', publish:'Publish Now' }[publishMode];
    setHostStep(1); return;
  }
  const authHeader = { 'Content-Type':'application/json','Authorization':`Bearer ${currentSession?.access_token}` };
  try {
    // ── 1. Create event (always as draft) ────────────────────
    const createRes = await fetch(`${API_BASE}/api/events`,{
      method:'POST',
      headers: authHeader,
      body: JSON.stringify({
        name, description:desc, cover_url:coverUrl, gallery_urls:galleryUrls, event_type:eventType,
        format, is_paid:isPaid, start_date:localInputToISO(startDate), end_date:localInputToISO(endDate),
        sales_cutoff: localInputToISO(document.getElementById('evSalesCutoff').value || endDate),
        venue_name:venueName, address, city, state, max_capacity:capacity?parseInt(capacity):null,
        online_url:onlineUrl||null,
        forum_enabled: document.getElementById('evForumEnabled')?.checked || false,
      }),
    });
    if (!createRes.ok) { const e=await createRes.json(); throw new Error(e.error||'Failed to create'); }
    const event = await createRes.json();

    // ── 2. Draft — save and stop here (no fee, no publish) ───
    if (isDraft) {
      listingFeePaymentMethodId = null; listingFeeHostEmail = null; listingFeePaid = false;
      publishMode = 'publish'; // reset for next use
      showToast('Event saved as draft','success');
      setTimeout(()=>goTo('profile'),1200);
      return;
    }

    // ── 3. Charge listing fee (paid events — scheduled & publish) ──
    if (isPaid) {
      if (!listingFeePaymentMethodId) throw new Error('Please complete the listing fee card step before continuing.');
      btn.innerHTML='<div class="spinner"></div>&nbsp;Processing payment…';
      const feeRes = await fetch(`${API_BASE}/api/charge-listing-fee`,{
        method:'POST', headers: authHeader,
        body: JSON.stringify({paymentMethodId:listingFeePaymentMethodId,eventId:event.id,hostEmail:listingFeeHostEmail,promoCode:listingFeePromoCode||undefined}),
      });
      const feeData = await feeRes.json();
      if (!feeData.success) {
        if (feeData.resetCard) resetListingCard();
        throw new Error(feeData.error||'Listing fee payment failed.');
      }
    }

    // ── 4a. Scheduled — store publish_at, auto-publisher handles the rest ──
    if (isScheduled) {
      const schedRes = await fetch(`${API_BASE}/api/events/${event.id}/schedule`,{
        method:'PATCH', headers: authHeader,
        body: JSON.stringify({ publish_at: scheduleAt }),
      });
      if (!schedRes.ok) { const e=await schedRes.json(); throw new Error(e.error||'Failed to schedule'); }
    } else {
      // ── 4b. Publish now ───────────────────────────────────
      const pubRes = await fetch(`${API_BASE}/api/events/${event.id}/publish`,{
        method:'PATCH', headers: authHeader,
      });
      if (!pubRes.ok) { const e=await pubRes.json(); throw new Error(e.error||'Failed to publish'); }
    }

    // ── 5. Create ticket types (paid events) ──────────────────
    if (isPaid) {
      const rows = document.querySelectorAll('.ticket-row');
      for (const row of rows) {
        const inputs = row.querySelectorAll('input');
        const ttName = inputs[0]?.value || 'General Admission';
        const price  = Math.round(parseFloat(inputs[1]?.value || 25) * 100);
        const qty    = parseInt(inputs[2]?.value || 100);
        const ttRes  = await fetch(`${API_BASE}/api/ticket-types`, {
          method: 'POST', headers: authHeader,
          body: JSON.stringify({ event_id: event.id, name: ttName, price_cents: price, quantity: qty }),
        });
        if (!ttRes.ok) {
          const e = await ttRes.json().catch(() => ({}));
          showToast('Ticket type error: ' + (e.error || 'Unknown'), 'error');
        }
      }
    }

    // ── 6. Done ───────────────────────────────────────────────
    // Save coupon codes
    const coupons = getCouponRowData();
    for (const c of coupons) {
      await fetch(`${API_BASE}/api/events/${event.id}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
        body: JSON.stringify(c),
      });
    }
    listingFeePaymentMethodId = null; listingFeeHostEmail = null; listingFeePaid = false;
    publishMode = 'publish'; // reset for next use
    if (isScheduled) {
      const schedDate = new Date(scheduleAt).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
      showToast(`Scheduled for ${schedDate}`,'success');
    } else {
      showToast('Event is live!','success');
      spawnConfetti();
    }
    fetchHomeEvents(); fetchDiscoveryRows();
    setTimeout(()=>goTo('profile'),1400);
  } catch(e) {
    showToast(e.message||'Something went wrong. Please try again.','error');
    btn.disabled=false;
    btn.textContent = { draft:'Save as Draft', scheduled:'Schedule Event', publish:'Publish Now' }[publishMode];
  }
}

// ═══════════════════════════════════════════════════════════
// COMMUNITY
// ═══════════════════════════════════════════════════════════
function escapeHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
// Escape text for use inside HTML attribute values (onclick strings)
function escapeAttr(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;')
    .replace(/\n/g, ' ')
    .slice(0, 120);
}
function formatTimeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7)  return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

async function initCommunityFeed(silent = false) {
  const feed = document.getElementById('communityFeed');
  if (!feed) return;
  // Only show skeleton on first visit — never blank the feed on background refresh
  if (!silent && feed.querySelectorAll('.feed-card').length === 0) {
    feed.innerHTML = [1,2].map(() => `
      <div class="feed-card" style="display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;align-items:center;gap:10px">
          <div class="skeleton" style="width:38px;height:38px;border-radius:50%;flex-shrink:0"></div>
          <div style="flex:1;display:flex;flex-direction:column;gap:6px">
            <div class="skeleton skeleton-line" style="width:40%"></div>
            <div class="skeleton skeleton-line" style="width:25%"></div>
          </div>
        </div>
        <div class="skeleton skeleton-line" style="width:90%"></div>
        <div class="skeleton skeleton-line" style="width:70%"></div>
      </div>`).join('');
  }
  try {
    const res = await fetch(`${API_BASE}/api/community-posts`, {
      headers: currentSession?.access_token ? { 'Authorization': `Bearer ${currentSession.access_token}` } : {},
    });
    const { posts, error } = await res.json();
    if (error) throw new Error(error);
    const currentCount = feed.querySelectorAll('.feed-card').length;
    // Only re-render if post count changed — prevents blank flash on no-op refreshes
    if (!silent || (posts || []).length !== currentCount) {
      renderCommunityFeed(posts || []);
    }
  } catch(e) {
    // On background refresh failure keep existing posts — don't blank the feed
    if (!silent) {
      feed.innerHTML = '<div style="text-align:center;padding:32px 0;color:var(--muted2);font-size:14px">Could not load posts.</div>';
    }
  }
}

function renderCommunityFeed(posts) {
  _repliesLoaded.clear(); // clear cache on full feed refresh
  const feed = document.getElementById('communityFeed');
  if (!feed) return;
  if (!posts.length) {
    feed.innerHTML = '<div style="text-align:center;padding:40px 0;color:var(--muted2);font-size:14px">No posts yet — be the first to share!</div>';
    return;
  }
  feed.innerHTML = '';
  posts.forEach(p => feed.appendChild(makeCommunityPost(p)));
  const dot = document.getElementById('communityDot');
  if (dot && posts.length > 0) dot.style.display = 'block';
}

function makeCommunityPost(p) {
  const el = document.createElement('div');
  el.className = 'feed-card';
  el.dataset.postId = p.id;
  const name       = p.profiles?.full_name || 'Anonymous';
  const initial    = name.charAt(0).toUpperCase();
  const isOwn      = currentUser && p.author_id === currentUser.id;
  const replyCount = p.reply_count || 0;

  const avHTML = p.profiles?.avatar_url
    ? `<div class="feed-av" style="background:transparent;overflow:hidden;padding:0;cursor:pointer" onclick="openPublicProfile('${p.author_id}')"><img alt="" src="${p.profiles.avatar_url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%"></div>`
    : `<div class="feed-av" style="background:${p.profiles?.avatar_color||'var(--gold)'};cursor:pointer" onclick="openPublicProfile('${p.author_id}')">${initial}</div>`;

  const ownerActions = isOwn ? `
    <div style="display:flex;gap:12px;margin-left:auto">
      <button onclick="editCommunityPost('${p.id}')" style="font-size:12px;color:var(--muted2);background:none;border:none;cursor:pointer;padding:0;font-weight:500">Edit</button>
      <button onclick="deleteCommunityPost('${p.id}')" style="font-size:12px;color:var(--red);background:none;border:none;cursor:pointer;padding:0;font-weight:500">Delete</button>
    </div>` : '';

  el.innerHTML = `
    <div class="feed-header">
      ${avHTML}
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:6px">
          <div class="feed-name" style="cursor:pointer" onclick="openPublicProfile('${p.author_id}')">${escapeHtml(name)}</div>
          ${ownerActions}
        </div>
        <div class="feed-time">${formatTimeAgo(p.created_at)}</div>
      </div>
    </div>
    <div class="feed-body" id="post-body-${p.id}" style="white-space:pre-wrap">${escapeHtml(p.body)}</div>
    <div class="feed-reactions">
      <button class="reaction-btn${p.has_amened ? ' active' : ''}" data-post-id="${p.id}" data-amened="${p.has_amened ? '1' : '0'}" onclick="amenPost('${p.id}',this)"><svg width="13" height="13" viewBox="0 0 32 32" fill="none" style="vertical-align:middle;margin-right:4px"><path d="M10 6 L10 18 C10 21 12.5 23 16 23 C19.5 23 22 21 22 18 L22 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 10 C8 9 7 11 7 13 C7 15 9 15 9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M22 10 C24 9 25 11 25 13 C25 15 23 15 23 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M13 27 L16 23 L19 27" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Amen <span>${p.amen_count||0}</span></button>
      <button class="reply-toggle-btn ${replyCount > 0 ? 'has-replies' : ''}" id="reply-toggle-${p.id}" onclick="toggleReplies('${p.id}', this)">
        <svg width="13" height="13" viewBox="0 0 32 32" fill="none" style="vertical-align:middle;margin-right:4px"><path d="M5 6 C5 5 6 4 7 4 L22 4 C23 4 24 5 24 6 L24 16 C24 17 23 18 22 18 L14 18 L9 23 L9 18 L7 18 C6 18 5 17 5 16 Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>${replyCount > 0 ? replyCount + ' repl' + (replyCount === 1 ? 'y' : 'ies') : 'Reply'}
      </button>
    </div>
    <div class="reply-section" id="reply-section-${p.id}">
      <div id="reply-list-${p.id}"></div>
      ${currentUser ? `
        <div class="reply-input-wrap" id="reply-input-wrap-${p.id}">
          <textarea
            class="reply-input"
            id="reply-input-${p.id}"
            placeholder="Write a reply…"
            rows="1"
            maxlength="500"
            oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,100)+'px'"
            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();submitReply('${p.id}')}"
          ></textarea>
          <button class="reply-submit-btn" onclick="submitReply('${p.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0A0F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>` : `
        <div style="font-size:12px;color:var(--muted);padding:8px 0">
          <button onclick="openAuth('signup')" style="color:var(--gold);font-weight:600;background:none;border:none;cursor:pointer;font-size:12px">Sign in</button> to reply
        </div>`}
    </div>`;

  return el;
}

async function amenPost(postId, btn) {
  if (!currentUser) { openAuth('signup'); return; }
  btn.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/api/community-posts/${postId}/amen`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    const data = await res.json();
    if (res.ok) {
      const countEl = btn.querySelector('span');
      if (countEl) countEl.textContent = data.amen_count;
      btn.dataset.amened = data.has_amened ? '1' : '0';
      btn.classList.toggle('active', data.has_amened);
    }
  } catch(e) { /* silent */ }
  finally { btn.disabled = false; }
}

async function postToFeed() {
  if (!currentUser) { openAuth('signup'); return; }
  const inp = document.getElementById('postInput');
  if (!inp.value.trim()) { showToast('Write something first'); return; }
  const body = inp.value.trim();
  const btn = document.querySelector('#postSubmitRow .btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Posting…'; }
  try {
    const res = await fetch(`${API_BASE}/api/community-posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
      body: JSON.stringify({ body }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to post');
    inp.value = '';
    document.getElementById('postSubmitRow').style.display = 'none';
    showToast('Posted!', 'success');
    await initCommunityFeed();
  } catch(e) {
    showToast(e.message || 'Failed to post', 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Post'; }
  }
}

function editCommunityPost(postId) {
  const bodyEl = document.getElementById(`post-body-${postId}`);
  if (!bodyEl) return;
  const current = bodyEl.textContent;
  // Replace body with inline editor
  bodyEl.outerHTML = `
    <div id="post-edit-wrap-${postId}">
      <textarea id="post-edit-${postId}" class="post-field" style="min-height:72px;margin-bottom:8px;border-radius:var(--r-sm)">${escapeHtml(current)}</textarea>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button onclick="cancelEditCommunityPost('${postId}','${escapeHtml(current).replace(/'/g,'&#39;')}')" style="font-size:13px;font-weight:600;color:var(--muted2);background:none;border:1px solid var(--border);border-radius:var(--r-full);padding:6px 16px;cursor:pointer">Cancel</button>
        <button onclick="saveCommunityPostEdit('${postId}')" style="font-size:13px;font-weight:700;color:#000;background:var(--gold);border:none;border-radius:var(--r-full);padding:6px 16px;cursor:pointer">Save</button>
      </div>
    </div>`;
  const ta = document.getElementById(`post-edit-${postId}`);
  if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
}

function cancelEditCommunityPost(postId, original) {
  const wrap = document.getElementById(`post-edit-wrap-${postId}`);
  if (!wrap) return;
  const div = document.createElement('div');
  div.className = 'feed-body';
  div.id = `post-body-${postId}`;
  div.style.whiteSpace = 'pre-wrap';
  div.textContent = original;
  wrap.replaceWith(div);
}

async function saveCommunityPostEdit(postId) {
  const ta = document.getElementById(`post-edit-${postId}`);
  if (!ta) return;
  const newBody = ta.value.trim();
  if (!newBody) { showToast('Post cannot be empty', 'error'); return; }
  ta.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/api/community-posts/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
      body: JSON.stringify({ body: newBody }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error || 'Failed to save', 'error'); ta.disabled = false; return; }
    // Replace editor with updated body
    const wrap = document.getElementById(`post-edit-wrap-${postId}`);
    if (wrap) {
      const div = document.createElement('div');
      div.className = 'feed-body';
      div.id = `post-body-${postId}`;
      div.style.whiteSpace = 'pre-wrap';
      div.textContent = data.body || newBody;
      wrap.replaceWith(div);
    }
    showToast('Post updated', 'success');
  } catch { showToast('Could not save. Try again.', 'error'); ta.disabled = false; }
}

async function deleteCommunityPost(postId) {
  if (!confirm('Delete this post?')) return;
  try {
    const res = await fetch(`${API_BASE}/api/community-posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    if (!res.ok) { const d = await res.json(); showToast(d.error || 'Failed to delete', 'error'); return; }
    // Remove card from DOM
    const card = document.querySelector(`.feed-card[data-post-id="${postId}"]`);
    if (card) card.remove();
    showToast('Post deleted', 'success');
  } catch { showToast('Could not delete. Try again.', 'error'); }
}

// ═══════════════════════════════════════════════════════════
// VERSE CAROUSEL
// ═══════════════════════════════════════════════════════════
let verseIdx = 0;
function initVerses() {
  const dots = document.getElementById('verseDots');
  dots.innerHTML = '';
  VERSES.forEach((_,i) => {
    const d = document.createElement('button');
    d.className = 'v-dot' + (i===0?' active':''); d.setAttribute('aria-label','Show verse '+(i+1));
    d.onclick = () => goVerse(i);
    dots.appendChild(d);
  });
  setInterval(()=>goVerse((verseIdx+1)%VERSES.length), 5500);
}
function goVerse(i) {
  const vt = document.getElementById('verseText');
  const vr = document.getElementById('verseRef');
  vt.style.opacity = vr.style.opacity = '0';
  setTimeout(()=>{
    verseIdx = i;
    vt.textContent = VERSES[i].t;
    vr.textContent = VERSES[i].r;
    vt.style.opacity = vr.style.opacity = '1';
    vt.classList.remove('animating'); vr.classList.remove('animating');
    void vt.offsetWidth;
    vt.classList.add('animating'); vr.classList.add('animating');
    document.querySelectorAll('.v-dot').forEach((d,j)=>d.classList.toggle('active',j===i));
  }, 400);
}

// ═══════════════════════════════════════════════════════════
// FOOTER PAGES
// ═══════════════════════════════════════════════════════════
const FOOTER_PAGES = {
  about:{title:'About Christ Link',body:'<p style="color:var(--muted2);line-height:1.8;font-size:15px;margin-bottom:14px">Christ Link was built to solve a simple problem — believers couldn\'t easily find or host faith-based events in their city.</p><p style="color:var(--muted2);line-height:1.8;font-size:15px">We connect ministries, churches, and community leaders with the people they serve. Built with faith. Powered by community.</p>'},
  privacy:{title:'Privacy Policy',body:`
<p style="color:var(--muted2);font-size:12px;margin-bottom:16px">Effective: April 2025 &nbsp;·&nbsp; ChristLink, operated by NolimitDae LLC</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px;margin-bottom:14px">We take your privacy seriously. This policy explains what data we collect, how we use it, and your rights.</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">1. Information We Collect</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px;margin-bottom:14px"><strong style="color:var(--text)">Account info:</strong> Your name and email address when you sign up.<br><strong style="color:var(--text)">Profile info:</strong> Any bio, city, photo, or social links you choose to add.<br><strong style="color:var(--text)">Event activity:</strong> Events you host, attend, or RSVP to.<br><strong style="color:var(--text)">Forum & community posts:</strong> Messages you send inside event forums or community features.<br><strong style="color:var(--text)">Payment info:</strong> We never store your card details. All payment processing is handled by Stripe, Inc. See <a href="https://stripe.com/privacy" target="_blank" style="color:var(--gold)">stripe.com/privacy</a>.<br><strong style="color:var(--text)">Device info:</strong> Browser type and general location (city-level) for fraud prevention.</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">2. How We Use Your Information</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px;margin-bottom:14px">· To create and manage your account<br>· To send event confirmations and ticket receipts to your email<br>· To process payments and payouts through Stripe<br>· To display your profile to other ChristLink users<br>· To improve the platform and prevent abuse<br><br>We <strong style="color:var(--text)">never sell your personal data</strong> to third parties.</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">3. Third-Party Services</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px;margin-bottom:14px"><strong style="color:var(--text)">Supabase</strong> — database and authentication hosting (US-based)<br><strong style="color:var(--text)">Stripe</strong> — payment processing and host payouts<br><strong style="color:var(--text)">Railway</strong> — server hosting<br>Each service has its own privacy policy. We share only the minimum data necessary for these services to function.</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">4. Data Retention</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px;margin-bottom:14px">We retain your account data for as long as your account is active. Event forum posts expire 30 days after the event ends. You may request deletion of your account and associated data at any time.</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">5. Your Rights</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px;margin-bottom:14px">You have the right to access, correct, or delete your personal data. To exercise these rights, email us at <strong style="color:var(--text)">info@christlinksocial.com</strong>. We will respond within 30 days.</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">6. Children's Privacy</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px;margin-bottom:14px">ChristLink is not directed to children under 13. We do not knowingly collect data from children under 13.</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">7. Changes to This Policy</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px;margin-bottom:14px">We may update this policy from time to time. We will notify users of significant changes via email or an in-app notice.</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">8. Contact</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px">Questions? Email us at <strong style="color:var(--text)">info@christlinksocial.com</strong></p>`},
  terms:{title:'Terms of Service',body:`
<p style="color:var(--muted2);font-size:12px;margin-bottom:16px">Effective: April 2025 &nbsp;·&nbsp; ChristLink, operated by NolimitDae LLC</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">1. Acceptance</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px;margin-bottom:14px">By creating an account you agree to these Terms. If you do not agree, do not use ChristLink.</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">2. Permitted Use</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px;margin-bottom:14px">ChristLink is a platform for faith-based events. You agree to use it only for lawful, legitimate purposes. You may not post fraudulent events, harass other users, or misrepresent your identity. Violation results in immediate account removal.</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">3. Event Listing Fees</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px;margin-bottom:14px">Hosting a paid event requires a one-time $19.99 listing fee. This fee is non-refundable once your event is published.</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">4. Platform Fee</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px;margin-bottom:14px">ChristLink retains 7% of each ticket sale as a platform fee. Payouts to hosts are processed via Stripe Connect after Stripe's standard processing fees.</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">5. Refunds</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px;margin-bottom:14px">Ticket refunds are at the discretion of the event host. ChristLink facilitates refund requests but does not guarantee refunds. The platform fee is non-refundable.</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">6. Content</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px;margin-bottom:14px">You retain ownership of content you post. By posting, you grant ChristLink a license to display it on the platform. You are solely responsible for content you submit.</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">7. Limitation of Liability</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px;margin-bottom:14px">ChristLink is a marketplace platform. We are not responsible for the conduct of event hosts or attendees. To the fullest extent permitted by law, our liability is limited to the amount you paid us in the 12 months prior to any claim.</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">8. Changes</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px;margin-bottom:14px">We may update these Terms. Continued use of the platform after changes constitutes acceptance.</p>
<p style="font-weight:700;color:var(--text);font-size:14px;margin-bottom:6px">9. Contact</p>
<p style="color:var(--muted2);line-height:1.8;font-size:14px">Questions? Email <strong style="color:var(--text)">info@christlinksocial.com</strong></p>`},
  contact:{title:'Contact Us',body:'<div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-md);padding:16px;margin-bottom:12px"><div style="font-size:11px;color:var(--gold);font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px">General &amp; Host Support</div><a href="mailto:info@christlinksocial.com" style="color:var(--text)">info@christlinksocial.com</a></div>'},
};
function showFooterPage(key) {
  const p = FOOTER_PAGES[key]; if (!p) return;
  document.getElementById('footerSheetTitle').textContent = p.title;
  document.getElementById('footerSheetBody').innerHTML   = p.body;
  openSheet('footerSheet');
}

function showLandingPage() {
  document.querySelectorAll('.page.active').forEach(p => p.classList.remove('active'));
  const lp = document.getElementById('page-landing');
  lp.classList.add('active');
  lp.style.display = 'flex';
  lp.style.overflow = 'hidden';
  lp.style.overscrollBehavior = 'none';
  lp.style.touchAction = 'none';
  lp.style.height = '100vh';
  lp.style.minHeight = '0';
  document.getElementById('tabbar').style.display = 'none';
  document.body.style.overflow = 'hidden';

  if (currentUser) {
    // Logged-in: keep topnav, hide landing's own nav + CTAs + Sign In
    document.getElementById('landingNavSection').style.display = 'none';
    document.getElementById('landingCtaSection').style.display = 'none';
    document.getElementById('landingSignInBtn').style.display = 'none';
    lp.style.paddingTop = 'calc(var(--nav-h) + var(--safe-t))';
  } else {
    // Logged-out: hide topnav, show landing nav with Sign In, safe-area top
    document.getElementById('topnav').style.display = 'none';
    document.getElementById('landingNavSection').style.display = '';
    document.getElementById('landingCtaSection').style.display = '';
    document.getElementById('landingBackBtn').style.display = 'none';
    document.getElementById('landingSignInBtn').style.display = '';
    lp.style.paddingTop = 'env(safe-area-inset-top, 0px)';
  }
  lp.scrollTop = 0;
  _landingSwipeInit(lp);
}

function hideLandingPage() {
  const lp = document.getElementById('page-landing');
  lp.classList.remove('active');
  lp.style.display = 'none';
  lp.style.overflow = '';
  lp.style.overscrollBehavior = '';
  lp.style.touchAction = '';
  lp.style.height = '';
  lp.style.minHeight = '';
  lp.style.paddingTop = '0';
  document.getElementById('landingNavSection').style.display = '';
  document.getElementById('landingCtaSection').style.display = '';
  document.getElementById('landingBackBtn').style.display = 'none';
  document.getElementById('landingSignInBtn').style.display = '';
  document.getElementById('tabbar').style.display = '';
  document.getElementById('topnav').style.display = '';
  document.body.style.overflow = '';
  _landingSwipeDestroy(lp);
  goTo('home');
}

// ── Swipe-right-to-go-back for landing page ───────────────
let _lsTouchX = 0, _lsTouchY = 0;
function _landingSwipeStart(e) {
  _lsTouchX = e.touches[0].clientX;
  _lsTouchY = e.touches[0].clientY;
}
function _landingSwipeEnd(e) {
  const dx = e.changedTouches[0].clientX - _lsTouchX;
  const dy = Math.abs(e.changedTouches[0].clientY - _lsTouchY);
  if (dx > 60 && dy < 80) hideLandingPage();
}
function _landingSwipeInit(el) {
  el.addEventListener('touchstart', _landingSwipeStart, { passive: true });
  el.addEventListener('touchend',   _landingSwipeEnd,   { passive: true });
}
function _landingSwipeDestroy(el) {
  el.removeEventListener('touchstart', _landingSwipeStart);
  el.removeEventListener('touchend',   _landingSwipeEnd);
}

// ═══════════════════════════════════════════════════════════
// SUCCESS
// ═══════════════════════════════════════════════════════════
function showSuccess(iconName, title, msg) {
  const el = document.getElementById('successIcon');
  if (el) el.innerHTML = icon(iconName, 64) || `<svg width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" stroke="#C9A84C" stroke-width="2.5" fill="rgba(201,168,76,.08)"/><path d="M18 32 L27 42 L46 22" stroke="#C9A84C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  document.getElementById('successTitle').textContent = title;
  document.getElementById('successMsg').textContent   = msg;
  openSheet('successSheet');
}

// ═══════════════════════════════════════════════════════════
// TICKET VIEWER — QR CODE GENERATION
// ═══════════════════════════════════════════════════════════
let currentViewedTicketId = null; // used by addToAppleWallet

function openTicketViewer(t) {
  if (!t) { showToast('Ticket data not available', 'error'); return; }
  try {
    currentViewedTicketId = t.id || null;

    // Header + cover
    document.getElementById('tvTitle').textContent     = t.event_name || 'Event';
    document.getElementById('tvDate').textContent      = t.event_start_date
      ? new Date(t.event_start_date).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',hour:'numeric',minute:'2-digit'})
      : 'Date TBD';
    document.getElementById('tvLocation').textContent  = t.event_city || '—';
    document.getElementById('tvQty').textContent       = t.quantity || 1;
    const admitEl = document.getElementById('tvAdmit');
    if (admitEl) admitEl.textContent = t.quantity || 1;
    document.getElementById('tvType').textContent      = t.ticket_type_name || 'General';
    document.getElementById('tvAmount').textContent    = t.total_charged_cents > 0
      ? `$${(t.total_charged_cents/100).toFixed(2)}`
      : 'Free';

    // Decorative barcode strips (deterministic from ticket code)
    const barcodeEl = document.getElementById('tvBarcodeStrips');
    if (barcodeEl) {
      const seed = (t.code || t.id || 'TICKET').split('').reduce((a,c) => a + c.charCodeAt(0), 0);
      const strips = Array.from({length: 36}, (_, i) => {
        const h = 6 + ((seed * (i + 7) * 13) % 14);
        const w = (i % 5 === 0) ? 3 : (i % 3 === 0) ? 2 : 1;
        return `<div style="width:${w}px;height:${h}px;background:#111;border-radius:1px;flex-shrink:0"></div>`;
      }).join('');
      barcodeEl.style.cssText = 'display:flex;gap:1.5px;align-items:flex-end;width:100%;padding:0 2px';
      barcodeEl.innerHTML = strips;
    }

    // Cover image — clear src when hiding to prevent ghost network requests
    const coverImg = document.getElementById('tvCoverImg');
    if (t.event_cover_url) {
      coverImg.src = t.event_cover_url;
      coverImg.style.display = 'block';
      document.getElementById('tvCoverEmoji').style.opacity = '0.15';
    } else {
      coverImg.src = '';
      coverImg.style.display = 'none';
      document.getElementById('tvCoverEmoji').style.opacity = '0.4';
    }

    // Status badge + shimmer
    const badge   = document.getElementById('tvStatusBadge');
    const shimmer = document.getElementById('tvShimmer');
    if (t.status === 'confirmed') {
      badge.innerHTML = '<svg width="11" height="11" viewBox="0 0 14 14" fill="none" style="vertical-align:middle;margin-right:3px"><path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Confirmed';
      badge.style.cssText = 'font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;padding:4px 16px;border-radius:999px;background:rgba(78,201,140,.12);color:#4EC98C;border:1px solid rgba(78,201,140,.3)';
      if (shimmer) shimmer.style.display = 'block';
    } else if (t.status === 'refunded') {
      badge.textContent = '↩ Refunded';
      badge.style.cssText = 'font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;padding:4px 16px;border-radius:999px;background:rgba(148,163,184,.08);color:#94a3b8;border:1px solid rgba(148,163,184,.2)';
      if (shimmer) shimmer.style.display = 'none';
    } else if (t.status === 'pending') {
      badge.textContent = '⏳ Pending';
      badge.style.cssText = 'font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;padding:4px 16px;border-radius:999px;background:rgba(201,168,76,.12);color:#C9A84C;border:1px solid rgba(201,168,76,.3)';
      if (shimmer) shimmer.style.display = 'none';
    } else {
      badge.textContent = t.status || 'Unknown';
      badge.style.cssText = 'font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;padding:4px 16px;border-radius:999px;background:rgba(255,255,255,.05);color:#888;border:1px solid rgba(255,255,255,.1)';
      if (shimmer) shimmer.style.display = 'none';
    }

    // Ticket code — always show something scannable
    const shortCode = (
      t.code ||
      (t.stripe_payment_intent ? t.stripe_payment_intent.replace(/[^a-zA-Z0-9]/g,'').slice(-8).toUpperCase() : null) ||
      t.id?.replace(/-/g,'').slice(0,8).toUpperCase() ||
      'TICKET01'
    );
    document.getElementById('tvTicketCode').textContent = shortCode;

    // QR payload — fields needed for scanner verification
    const qrPayload = JSON.stringify({
      ticketId: t.id,
      eventId:  t.event_id,
      code:     shortCode,
      status:   t.status,
    });

    // Render QR using qrcodejs (browser-native, no canvas package dependency)
    const qrContainer = document.getElementById('tvQrContainer');
    const qrSize      = Math.max(180, Math.min(window.innerWidth - 112, 220));
    qrContainer.innerHTML = '';

    try {
      if (typeof QRCode !== 'undefined') {
        new QRCode(qrContainer, {
          text:         qrPayload,
          width:        qrSize,
          height:       qrSize,
          colorDark:    '#000000',
          colorLight:   '#ffffff',
          correctLevel: QRCode.CorrectLevel.M,
        });
      } else {
        qrContainer.innerHTML = `<div style="width:${qrSize}px;height:${qrSize}px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:#f5f5f5;border-radius:8px"><div style="font-size:12px;color:#555;font-weight:600">Ticket Code</div><div style="font-size:20px;font-weight:800;letter-spacing:.18em;font-family:monospace;color:#000">${shortCode}</div></div>`;
      }
    } catch(e) {
      console.error('[QR]', e);
      qrContainer.innerHTML = `<div style="width:${qrSize}px;height:${qrSize}px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:#f5f5f5;border-radius:8px"><div style="font-size:12px;color:#555;font-weight:600">Ticket Code</div><div style="font-size:20px;font-weight:800;letter-spacing:.18em;font-family:monospace;color:#000">${shortCode}</div></div>`;
    }

    // Checked-in stamp
    const stamp = document.getElementById('tvCheckedInStamp');
    if (stamp) {
      if (t.checked_in) {
        stamp.style.display = 'flex';
        const timeEl = document.getElementById('tvCheckedInTime');
        if (timeEl && t.checked_in_at) {
          timeEl.textContent = 'Checked in ' + new Date(t.checked_in_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        }
      } else {
        stamp.style.display = 'none';
      }
    }

    // Refund button — show only to event host for confirmed paid tickets
    const refundBtn = document.getElementById('tvRefundBtn');
    if (refundBtn) {
      const isHost = t.event_host_id && currentUser?.id === t.event_host_id;
      const isPaid = (t.total_charged_cents || 0) > 0;
      refundBtn.style.display = (isHost && isPaid && t.status === 'confirmed') ? 'block' : 'none';
    }

    // Re-trigger ticket card entrance animation
    const card = document.getElementById('tvTicketCard');
    if (card) { card.style.animation = 'none'; void card.offsetWidth; card.style.animation = ''; }

    openSheet('ticketViewerSheet');
  } catch (err) {
    console.error('[openTicketViewer]', err);
    showToast('Could not open ticket — please try again', 'error');
  }
}

async function requestTicketRefund() {
  if (!currentViewedTicketId) return;
  if (!confirm('Refund this ticket? The full amount will be returned to the buyer.')) return;
  const btn = document.getElementById('tvRefundBtn');
  btn.disabled = true; btn.textContent = 'Processing…';
  try {
    const res = await fetch(`${API_BASE}/api/tickets/${currentViewedTicketId}/refund`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Refund failed');
    showToast('Refund issued successfully', 'success');
    closeSheet('ticketViewerSheet');
  } catch (e) {
    showToast(e.message, 'error');
    btn.disabled = false; btn.textContent = 'Request Refund';
  }
}

// ═══════════════════════════════════════════════════════════
// REFUND REQUEST FLOW (attendee-initiated)
// ═══════════════════════════════════════════════════════════
let _refundTicket = null;

function openRefundRequestSheet(t) {
  _refundTicket = t;
  document.getElementById('refundReqEventName').textContent = t.event_name || 'Event';
  document.getElementById('refundAmountLabel').textContent  = t.total_charged_cents > 0
    ? `$${(t.total_charged_cents / 100).toFixed(2)}` : 'Free';
  document.getElementById('refundReasonInput').value = '';
  document.getElementById('refundReqErr').textContent = '';
  const btn = document.getElementById('refundReqSubmitBtn');
  btn.disabled = false; btn.textContent = 'Send Refund Request';
  openSheet('refundRequestSheet');
}

async function submitRefundRequest() {
  if (!_refundTicket) return;
  const reason = document.getElementById('refundReasonInput').value.trim();
  const btn = document.getElementById('refundReqSubmitBtn');
  const errEl = document.getElementById('refundReqErr');
  errEl.textContent = '';
  btn.disabled = true; btn.textContent = 'Sending…';
  try {
    const res = await fetch(`${API_BASE}/api/tickets/${_refundTicket.id}/request-refund`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    // Show sent confirmation inside the sheet, then auto-close
    const body = document.querySelector('#refundRequestSheet .sheet-body');
    if (body) {
      body.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 0;gap:14px;text-align:center">
          <div style="width:56px;height:56px;border-radius:50%;background:rgba(78,201,140,.12);border:1.5px solid rgba(78,201,140,.3);display:flex;align-items:center;justify-content:center"><svg width="28" height="28" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke="#4EC98C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <div style="font-size:17px;font-weight:700;color:var(--text)">Request Sent</div>
          <div style="font-size:14px;color:var(--muted2);line-height:1.6;max-width:280px">Your refund request has been sent to the host. You'll get a notification once they respond.</div>
          <button class="btn btn-secondary" style="margin-top:8px" onclick="closeSheet('refundRequestSheet')">Close</button>
        </div>`;
    }
    setTimeout(() => closeSheet('refundRequestSheet'), 3000);
  } catch (e) {
    errEl.textContent = e.message;
    btn.disabled = false; btn.textContent = 'Send Refund Request';
  }
}

// ═══════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════
async function fetchNotifCount() {
  if (!currentUser) return;
  try {
    const res = await fetch(`${API_BASE}/api/notifications`, {
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    if (!res.ok) return;
    const { notifications } = await res.json();
    const unread = (notifications || []).filter(n => !n.read).length;
    const badge = document.getElementById('notifBadge');
    if (badge) badge.style.display = unread > 0 ? 'block' : 'none';
  } catch {}
}

async function openNotifSheet() {
  const list = document.getElementById('notifList');
  list.innerHTML = '<div style="color:var(--muted);font-size:14px;text-align:center;padding:24px 0">Loading…</div>';
  openSheet('notifSheet');
  try {
    const res = await fetch(`${API_BASE}/api/notifications`, {
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    const { notifications } = await res.json();
    if (!notifications?.length) {
      list.innerHTML = '<div style="color:var(--muted);font-size:14px;text-align:center;padding:24px 0">No notifications yet.</div>';
      return;
    }

    const typeIcon = {
      ticket_sale:   '<svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M4 11 C4 9.5 5 9 6 9 L26 9 C27 9 28 9.5 28 11 C28 11 26 12 26 14 C26 16 28 17 28 17 C28 18.5 27 19 26 19 L6 19 C5 19 4 18.5 4 17 C4 17 6 16 6 14 C6 12 4 11 4 11Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/></svg>',
      refund_request: '<svg width="18" height="18" viewBox="0 0 32 32" fill="none"><rect x="3" y="9" width="26" height="15" rx="2" stroke="#C9A84C" stroke-width="2"/><circle cx="16" cy="16.5" r="3.5" stroke="#C9A84C" stroke-width="1.5"/></svg>',
      refund_approved:'<svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke="#4EC98C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      refund_denied:  '<svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="#E05050" stroke-width="2" stroke-linecap="round"/></svg>',
      event_invite:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="16" y1="11" x2="22" y2="11"/><line x1="19" y1="8" x2="19" y2="14"/></svg>'
    };
    list.innerHTML = notifications.map(n => {
      const ago = (() => {
        const d = Math.floor((Date.now() - new Date(n.created_at)) / 60000);
        if (d < 1) return 'just now';
        if (d < 60) return `${d}m ago`;
        if (d < 1440) return `${Math.floor(d/60)}h ago`;
        return `${Math.floor(d/1440)}d ago`;
      })();
      return `<div style="display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--border);${n.read?'opacity:.6':''}">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0">${typeIcon[n.type] || '<svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M16 4 C11 4 8 8 8 13 L8 20 L5 23 L27 23 L24 20 L24 13 C24 8 21 4 16 4Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/><path d="M13 23 C13 24.7 14.3 26 16 26 C17.7 26 19 24.7 19 23" stroke="#C9A84C" stroke-width="2"/></svg>'}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:${n.read?'500':'700'};color:var(--text);margin-bottom:3px">${escapeHtml(n.title)}</div>
          ${n.body ? `<div style="font-size:13px;color:var(--muted2);line-height:1.5">${escapeHtml(n.body)}</div>` : ''}
          <div style="font-size:11px;color:var(--muted);margin-top:4px">${ago}</div>
          ${n.type === 'refund_request' && n.data?.refund_request_id ? `
            <div style="display:flex;gap:8px;margin-top:10px">
              <button onclick="handleRefundRequest('${n.data.refund_request_id}','approve',this)" style="padding:7px 18px;background:rgba(78,201,140,.1);color:#4EC98C;border:1px solid rgba(78,201,140,.3);border-radius:var(--r-full);font-size:13px;font-weight:600;cursor:pointer">Approve</button>
              <button onclick="handleRefundRequest('${n.data.refund_request_id}','deny',this)" style="padding:7px 18px;background:rgba(239,68,68,.07);color:#ef4444;border:1px solid rgba(239,68,68,.2);border-radius:var(--r-full);font-size:13px;font-weight:600;cursor:pointer">Deny</button>
            </div>` : ''}
          ${n.type === 'event_invite' && n.data?.event_id ? `
            <button onclick="viewEventFromNotif('${n.data.event_id}')" style="margin-top:9px;padding:7px 18px;background:rgba(201,168,76,.1);color:var(--gold);border:1px solid rgba(201,168,76,.25);border-radius:var(--r-full);font-size:13px;font-weight:600;cursor:pointer">View Event →</button>
          ` : ''}
        </div>
      </div>`;
    }).join('');

    // Mark all read
    fetch(`${API_BASE}/api/notifications/read-all`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    const badge = document.getElementById('notifBadge');
    if (badge) badge.style.display = 'none';
  } catch {
    list.innerHTML = '<div style="color:var(--muted);font-size:14px;text-align:center;padding:24px 0">Could not load notifications.</div>';
  }
}

async function handleRefundRequest(requestId, action, btn) {
  btn.disabled = true;
  btn.textContent = action === 'approve' ? 'Processing…' : 'Denying…';
  try {
    const res = await fetch(`${API_BASE}/api/refund-requests/${requestId}/${action}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    showToast(action === 'approve' ? 'Refund issued' : 'Request denied', 'success');
    // Re-render notification list
    openNotifSheet();
  } catch (e) {
    showToast(e.message, 'error');
    btn.disabled = false;
    btn.textContent = action === 'approve' ? 'Approve' : 'Deny';
  }
}

// Close any open ticket dropdown when clicking elsewhere
document.addEventListener('click', () => {
  document.querySelectorAll('.ticket-dropdown').forEach(d => { d.style.display = 'none'; });
});

// ═══════════════════════════════════════════════════════════
// SEND INVITES
// ═══════════════════════════════════════════════════════════
let _inviteFollowers = [];
let _inviteSelected  = new Set();

async function openInviteSheet() {
  if (!currentUser) { openAuth('signin'); return; }
  if (!selectedEvent) return;
  _inviteSelected.clear();
  _inviteFollowers = [];
  const searchEl = document.getElementById('inviteSearchInput');
  if (searchEl) searchEl.value = '';
  const nameEl = document.getElementById('inviteEventName');
  if (nameEl) nameEl.textContent = selectedEvent.name || '';
  _updateInviteFooter();
  document.getElementById('inviteList').innerHTML =
    '<div style="text-align:center;padding:36px;color:var(--muted);font-size:14px">Loading followers…</div>';
  openSheet('inviteSheet');
  try {
    const res  = await fetch(`${API_BASE}/api/followers`, {
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` }
    });
    const data = await res.json();
    _inviteFollowers = data.followers || [];
    _renderInviteList(_inviteFollowers);
  } catch {
    document.getElementById('inviteList').innerHTML =
      '<div style="text-align:center;padding:36px;color:var(--muted);font-size:14px">Could not load followers.</div>';
  }
}

function _renderInviteList(list) {
  const el = document.getElementById('inviteList');
  if (!list.length) {
    el.innerHTML = '<div style="text-align:center;padding:48px 24px;color:var(--muted);font-size:14px;line-height:1.6">' +
      (_inviteFollowers.length ? 'No followers match your search.' : 'You have no followers yet.') + '</div>';
    return;
  }
  el.innerHTML = list.map(f => {
    const sel      = _inviteSelected.has(f.id);
    const initials = (f.full_name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const av       = f.avatar_url
      ? `<img alt="" src="${f.avatar_url}" style="width:100%;height:100%;object-fit:cover">`
      : initials;
    return `<div onclick="toggleInvitee('${f.id}')" style="display:flex;align-items:center;gap:12px;padding:11px 10px;border-radius:var(--r-md);margin-bottom:2px;cursor:pointer;background:${sel ? 'rgba(201,168,76,.09)' : 'transparent'};transition:background .15s">
      <div style="width:42px;height:42px;border-radius:50%;background:${f.avatar_color || 'linear-gradient(135deg,var(--gold),#6B4A00)'};display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#0A0A0F;flex-shrink:0;overflow:hidden">${av}</div>
      <div style="flex:1;font-size:14px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(f.full_name || 'Unknown')}</div>
      <div style="width:22px;height:22px;border-radius:50%;border:2px solid ${sel ? 'var(--gold)' : 'var(--border)'};background:${sel ? 'var(--gold)' : 'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s">
        ${sel ? '<svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
      </div>
    </div>`;
  }).join('');
}

function filterInviteList(q) {
  const filtered = q.trim()
    ? _inviteFollowers.filter(f => (f.full_name || '').toLowerCase().includes(q.toLowerCase()))
    : _inviteFollowers;
  _renderInviteList(filtered);
}

function toggleInvitee(userId) {
  _inviteSelected.has(userId) ? _inviteSelected.delete(userId) : _inviteSelected.add(userId);
  _updateInviteFooter();
  filterInviteList(document.getElementById('inviteSearchInput')?.value || '');
}

function _updateInviteFooter() {
  const n       = _inviteSelected.size;
  const countEl = document.getElementById('inviteSelectedCount');
  const sendBtn = document.getElementById('inviteSendBtn');
  if (countEl) countEl.textContent = n === 0 ? 'No followers selected' : `${n} follower${n > 1 ? 's' : ''} selected`;
  if (sendBtn) { sendBtn.disabled = n === 0; sendBtn.style.opacity = n === 0 ? '.45' : '1'; }
}

async function sendInvites() {
  if (!_inviteSelected.size || !selectedEvent) return;
  const btn = document.getElementById('inviteSendBtn');
  const orig = btn.textContent;
  btn.disabled = true; btn.textContent = 'Sending…';
  try {
    const res  = await fetch(`${API_BASE}/api/events/${selectedEvent.id}/invite`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
      body:    JSON.stringify({ followerIds: [..._inviteSelected] })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send invites');
    closeSheet('inviteSheet');
    showToast(`Invited ${data.sent} follower${data.sent > 1 ? 's' : ''}!`, 'success');
  } catch (e) {
    showToast(e.message || 'Could not send invites', 'error');
    btn.disabled = false; btn.textContent = orig; btn.style.opacity = '1';
  }
}

async function viewEventFromNotif(eventId) {
  closeSheet('notifSheet');
  try {
    const res = await fetch(`${API_BASE}/api/events/${eventId}`);
    const ev  = await res.json();
    if (ev?.id) { viewDetail(ev); goTo('event-detail'); }
    else showToast('Event not found', 'error');
  } catch { showToast('Could not load event', 'error'); }
}

// ═══════════════════════════════════════════════════════════
// TICKET SCANNER — FOR HOSTS
// ═══════════════════════════════════════════════════════════
const _ticketCache = {}; // id → ticket object, populated by fetchMyTickets
let scannerStream    = null;
let scannerLoop      = null;
let scannerPaused    = false;
let scannerEventId   = null;
let scannerCheckedIn = 0;
let scannedCodes     = new Set(); // prevent double-scan in same session

function openScannerSheet(eventId, eventName) {
  eventName = decodeURIComponent(eventName || '');
  if (!currentUser) { openAuth('signin'); return; }
  scannerEventId = eventId;
  scannerPaused  = false;
  scannerCheckedIn = 0;
  scannedCodes.clear();
  const manInput = document.getElementById('manualCodeInput');
  if (manInput) manInput.value = '';
  updateScannerStats(0, 0);
  openSheet('scannerSheet');
  const scanResult = document.getElementById('scanResult');
  if (scanResult) scanResult.style.display = 'none';
  const recentList = document.getElementById('recentScansList');
  if (recentList) recentList.innerHTML = '<div data-empty style="font-size:13px;color:var(--muted);padding:8px 0">No check-ins yet.</div>';
  const evNameEl = document.getElementById('scannerEventName');
  if (evNameEl) evNameEl.textContent = eventName || 'Event';
  // Load attendance counts
  loadAttendanceCounts(eventId);
  setTimeout(startCamera, 300);
}

async function loadAttendanceCounts(eventId) {
  try {
    const res = await fetch(`${API_BASE}/api/events/${eventId}/attendance`, {
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` }
    });
    if (res.ok) {
      const d = await res.json();
      scannerCheckedIn = d.checked_in || 0;
      updateScannerStats(scannerCheckedIn, d.total || 0);
    }
  } catch {}
}

async function startCamera() {
  try {
    scannerStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width:{ ideal:1280 }, height:{ ideal:720 } }
    });
    const video = document.getElementById('scannerVideo');
    video.srcObject = scannerStream;
    await video.play();
    const statusEl = document.getElementById('scannerCamStatus');
    if (statusEl) statusEl.style.display = 'none';
    startScanLoop();
  } catch(e) {
    setScanStatus('Camera access denied. Use manual entry below.');
  }
}

function startScanLoop() {
  const video  = document.getElementById('scannerVideo');
  const canvas = document.getElementById('scannerCanvas');
  const ctx    = canvas.getContext('2d');
  scannerLoop  = setInterval(() => {
    if (scannerPaused || video.readyState !== video.HAVE_ENOUGH_DATA) return;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });
    if (code) handleScannedCode(code.data);
  }, 200);
}

function stopCamera() {
  clearInterval(scannerLoop);
  scannerLoop = null;
  if (scannerStream) {
    scannerStream.getTracks().forEach(t => t.stop());
    scannerStream = null;
  }
}

function closeScannerSheet() {
  stopCamera();
  closeSheet('scannerSheet');
}

function setScanStatus(msg, type = '') {
  const el = document.getElementById('scannerCamStatus');
  if (!el) return;
  el.textContent = msg;
}

function resumeScanning() {
  scannerPaused = false;
  const scanResult = document.getElementById('scanResult');
  if (scanResult) scanResult.style.display = 'none';
}

async function handleScannedCode(raw) {
  if (scannerPaused) return;
  let payload;
  try { payload = JSON.parse(raw); } catch { return; } // ignore non-JSON
  if (!payload.ticketId && !payload.code) return;

  const dedupeKey = payload.ticketId || payload.code;
  if (scannedCodes.has(dedupeKey)) {
    showScanResult('warning', 'Already Scanned', 'This ticket was already checked in this session.');
    addRecentScan(payload.event_name || payload.code, payload.code || dedupeKey, 'warning');
    return;
  }

  scannerPaused = true;

  try {
    const res = await fetch(`${API_BASE}/api/tickets/verify`, {
      method:  'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${currentSession?.access_token}` },
      body:    JSON.stringify({ ticketId: payload.ticketId, code: payload.code, eventId: scannerEventId }),
    });
    const data = await res.json();

    if (data.valid) {
      scannedCodes.add(dedupeKey);
      scannerCheckedIn++;
      const total = parseInt(document.getElementById('statTotal')?.textContent) || 0;
      updateScannerStats(scannerCheckedIn, total);
      showScanResult('success', 'Valid Ticket', data.message || 'Check-in confirmed.');
      addRecentScan(data.ticket?.event_name || payload.code, data.ticket?.code || dedupeKey, 'success');
    } else {
      showScanResult('error', 'Invalid Ticket', data.error || 'This ticket could not be verified.');
      addRecentScan(payload.code || dedupeKey, dedupeKey, 'error');
    }
    scannerPaused = false;
  } catch(e) {
    // Offline fallback — verify locally from QR data
    if (payload.status === 'confirmed' && payload.eventId === scannerEventId) {
      scannedCodes.add(dedupeKey);
      scannerCheckedIn++;
      const total = parseInt(document.getElementById('statTotal')?.textContent) || 0;
      updateScannerStats(scannerCheckedIn, total);
      showScanResult('success', 'Valid Ticket (Offline)', 'Check-in recorded. Will sync when online.');
      addRecentScan(payload.event_name || payload.code, payload.code || dedupeKey, 'success');
    } else {
      showScanResult('error', 'Cannot Verify', 'Network unavailable. Check ticket manually.');
      addRecentScan(payload.code || dedupeKey, dedupeKey, 'error');
    }
    scannerPaused = false;
  }
}

function showScanResult(status, title, sub) {
  const el    = document.getElementById('scanResult');
  const inner = document.getElementById('scanResultInner');
  const icon  = document.getElementById('scanResultIcon');
  const ttl   = document.getElementById('scanResultTitle');
  const subEl = document.getElementById('scanResultSub');
  if (!el) return;
  const colors = {
    success: { bg: 'rgba(34,197,94,.12)',  border: 'rgba(34,197,94,.3)',  icon: '<svg width="20" height="20" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>', color: 'var(--green)' },
    error:   { bg: 'rgba(239,68,68,.12)',  border: 'rgba(239,68,68,.3)',  icon: '<svg width="20" height="20" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>', color: 'var(--red)'   },
    warning: { bg: 'rgba(251,191,36,.12)', border: 'rgba(251,191,36,.3)', icon: '<svg width="20" height="20" viewBox="0 0 14 14" fill="none"><path d="M7 2L13 12H1L7 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="7" y1="6" x2="7" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="10.5" r="0.7" fill="currentColor"/></svg>', color: 'var(--gold)'  },
  };
  const c = colors[status] || colors.error;
  inner.style.cssText = `padding:12px 14px;display:flex;align-items:center;gap:10px;background:${c.bg};border:1px solid ${c.border};border-radius:var(--r-md)`;
  icon.style.color    = c.color;
  icon.innerHTML      = c.icon;
  ttl.textContent     = title;
  subEl.textContent   = sub || '';
  el.style.display    = 'block';
  clearTimeout(el._hideTimer);
  el._hideTimer = setTimeout(() => { el.style.display = 'none'; }, 3000);
}

async function verifyManualCode() {
  const code = document.getElementById('manualCodeInput').value.trim().toUpperCase();
  if (!code) return;
  await handleScannedCode(JSON.stringify({ code, eventId: scannerEventId }));
}

// ═══════════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════════
let toastTimer;
function showToast(msg, type='') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' '+type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 3000);
}

// ═══════════════════════════════════════════════════════════
// CONFETTI
// ═══════════════════════════════════════════════════════════
function spawnConfetti() {
  const colors = ['#C9A84C','#E8C97A','#fff','#FFD700','#D4AF37','#FFF0A0'];
  for (let i=0;i<28;i++) {
    setTimeout(()=>{
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText=`left:${Math.random()*100}vw;top:-10px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>.5?'50%':'2px'};animation-duration:${1.4+Math.random()*0.8}s;animation-delay:${Math.random()*.3}s;`;
      document.body.appendChild(el);
      setTimeout(()=>el.remove(),2600);
    },i*18);
  }
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════

(function handleReturnParams() {
  const params = new URLSearchParams(window.location.search);

  if (params.get('connected') === '1') {
    window.history.replaceState({}, '', window.location.pathname);

    // Wait for auth session to be ready before syncing
    let attempts = 0;
    const waitForAuth = setInterval(async () => {
      attempts++;
      const sessionReady = currentSession?.access_token || attempts > 30;
      if (!sessionReady) return;
      clearInterval(waitForAuth);

      goTo('profile');

      // Call server to sync Stripe account status from Stripe API
      try {
        const res = await fetch(`${API_BASE}/api/connect-sync`, {
          method:  'POST',
          headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
        });
        const data = await res.json();

        if (res.ok && data.payoutsEnabled) {
          showToast('Stripe connected! You can now accept payments.', 'success');
        } else if (res.ok && data.onboardingComplete) {
          showToast('Setup submitted — Stripe is verifying your account (usually minutes).', 'success');
        } else {
          showToast('Onboarding saved. Finish setup to enable payouts.', 'error');
        }
      } catch (e) {
        showToast('Connected! Refreshing your profile…', 'success');
      }

      await fetchProfile();
      renderStripeConnectStatus();
    }, 100);

    // Fallback after 5s
    setTimeout(() => {
      clearInterval(waitForAuth);
      if (!document.getElementById('page-profile')?.classList.contains('active')) goTo('profile');
      fetchProfile();
    }, 5000);
  }

  if (params.get('reauth') === '1') {
    window.history.replaceState({}, '', window.location.pathname);
    let _count = 0;
    const waitForReauth = setInterval(() => {
      _count++;
      if (currentSession?.access_token || _count > 30) {
        clearInterval(waitForReauth);
        goTo('profile');
        showToast('Please reconnect your Stripe account to receive payouts.', 'error');
        fetchProfile();
      }
    }, 100);
  }

  if (params.get('listing_success') === '1') {
    window.history.replaceState({}, '', window.location.pathname);
    setTimeout(() => showToast('Listing fee paid — ticketing unlocked!', 'success'), 800);
  }
})();

// Restore page from hash on load (fixes refresh losing current page)
restorePageFromHash();

// ═══════════════════════════════════════════════════════════
// SHARE SYSTEM
// ═══════════════════════════════════════════════════════════

// Share platforms config
const SHARE_PLATFORMS = [
  {
    id:    'native',
    label: 'Share…',
    icon:  '<svg width="20" height="20" viewBox="0 0 32 32" fill="none"><path d="M20 6 L26 12 L20 18" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 12 L12 12 C8.7 12 6 14.7 6 18 L6 26" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>',
    color: '#C9A84C',
    // handled separately — uses Web Share API
  },
  {
    id:    'messages',
    label: 'Messages',
    icon:  '<svg width="20" height="20" viewBox="0 0 32 32" fill="none"><path d="M5 6 C5 5 6 4 7 4 L22 4 C23 4 24 5 24 6 L24 16 C24 17 23 18 22 18 L14 18 L9 23 L9 18 L7 18 C6 18 5 17 5 16 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round"/></svg>',
    color: '#4EC98C',
    url:   (u, t) => `sms:?body=${enc(t + ' ' + u)}`,
  },
  {
    id:    'whatsapp',
    label: 'WhatsApp',
    icon:  '<svg width="20" height="20" viewBox="0 0 32 32" fill="none"><rect x="9" y="3" width="14" height="26" rx="3" stroke="#C9A84C" stroke-width="2"/><circle cx="16" cy="26" r="1.5" fill="#C9A84C"/><line x1="13" y1="7" x2="19" y2="7" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>',
    color: '#25D366',
    url:   (u, t) => `https://wa.me/?text=${enc(t + '\n' + u)}`,
  },
  {
    id:    'twitter',
    label: 'X / Twitter',
    icon:  '𝕏',
    color: '#fff',
    url:   (u, t) => `https://twitter.com/intent/tweet?text=${enc(t)}&url=${enc(u)}`,
  },
  {
    id:    'facebook',
    label: 'Facebook',
    icon:  '<svg width="20" height="20" viewBox="0 0 32 32" fill="none"><circle cx="12" cy="10" r="4" stroke="#C9A84C" stroke-width="2"/><circle cx="22" cy="12" r="3" stroke="#C9A84C" stroke-width="2"/><path d="M4 28 C4 22 7.5 18 12 18 C16.5 18 20 22 20 28" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M20 19 C21 18.2 22.5 17.5 24 17.5 C27 17.5 29 20 29 23" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/></svg>',
    color: '#1877F2',
    url:   (u, t) => `https://www.facebook.com/sharer/sharer.php?u=${enc(u)}`,
  },
  {
    id:    'copy',
    label: 'Copy Link',
    icon:  '<svg width="20" height="20" viewBox="0 0 32 32" fill="none"><path d="M13 19 C13 19 10 22 8 22 C5.8 22 4 20.2 4 18 C4 15.8 5.8 14 8 14 L12 14" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><path d="M19 13 C19 13 22 10 24 10 C26.2 10 28 11.8 28 14 C28 16.2 26.2 18 24 18 L20 18" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/><line x1="11" y1="21" x2="21" y2="11" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/></svg>',
    color: 'var(--gold)',
    url:   null, // handled separately
  },
];

function enc(str) { return encodeURIComponent(str || ''); }

// Build the share URL for an event
function buildShareUrl(eventId) {
  return `${location.origin}${location.pathname}#event/${eventId}`;
}

// Build share text
function buildShareText(name, description) {
  const desc = description
    ? ' — ' + description.slice(0, 80) + (description.length > 80 ? '…' : '')
    : '';
  return `${name}${desc} | Christ Link`;
}

// ── Share from event DETAIL page (uses selectedEvent) ────────
async function shareEvent() {
  if (!selectedEvent) return;
  await doShare(
    selectedEvent.id,
    selectedEvent.name,
    selectedEvent.description,
    document.getElementById('detailShareBtn')
  );
}

// ── Share from event CARD (called with event data directly) ──
async function shareEventById(eventId, name, description, anchorBtn) {
  await doShare(eventId, name, description, anchorBtn);
}

// ── Core share logic ─────────────────────────────────────────
async function doShare(eventId, name, description, anchorBtn) {
  const url   = buildShareUrl(eventId);
  const title = name || 'Christ Link Event';
  const text  = buildShareText(name, description);

  // Try native Web Share API first (works on iOS Safari, Android Chrome)
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      // Flash the button green on success
      if (anchorBtn) flashShareBtn(anchorBtn);
      return;
    } catch (e) {
      // User cancelled (AbortError) — don't show fallback
      if (e.name === 'AbortError') return;
      // Other error — fall through to popover
    }
  }

  // Desktop / unsupported browser — show custom popover
  openSharePopover(eventId, url, text, anchorBtn);
}

// ── Custom share popover for desktop ─────────────────────────
function openSharePopover(eventId, url, text, anchorBtn) {
  // Close any existing popover
  closeSharePopover();

  // Backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'share-popover-backdrop';
  backdrop.id = 'share-popover-backdrop';
  backdrop.onclick = closeSharePopover;
  document.body.appendChild(backdrop);

  // Popover
  const popover = document.createElement('div');
  popover.className = 'share-popover';
  popover.id = 'share-popover';

  // Title
  const titleEl = document.createElement('div');
  titleEl.className = 'share-popover-title';
  titleEl.textContent = 'Share Event';
  popover.appendChild(titleEl);

  // Platform buttons
  SHARE_PLATFORMS.forEach(({ id, label, icon, color, url: urlFn }) => {
    if (id === 'native') return; // skip — handled above

    const btn = document.createElement('button');
    btn.className = 'share-popover-item';
    btn.innerHTML = `
      <div class="share-popover-icon" style="background:${color}22;color:${color}">${icon}</div>
      <span>${label}</span>
    `;

    if (id === 'copy') {
      btn.onclick = async () => {
        closeSharePopover();
        await copyToClipboard(url, anchorBtn);
      };
    } else {
      btn.onclick = () => {
        closeSharePopover();
        window.open(urlFn(url, text), '_blank', 'noopener,noreferrer');
        if (anchorBtn) flashShareBtn(anchorBtn);
      };
    }

    // Add divider before Copy Link
    if (id === 'copy') {
      const divider = document.createElement('div');
      divider.className = 'share-popover-divider';
      popover.appendChild(divider);
    }

    popover.appendChild(btn);
  });

  document.body.appendChild(popover);

  // Position popover near anchor button
  positionSharePopover(popover, anchorBtn);

  // Close on Escape
  const onKey = (e) => {
    if (e.key === 'Escape') { closeSharePopover(); document.removeEventListener('keydown', onKey); }
  };
  document.addEventListener('keydown', onKey);
}

function positionSharePopover(popover, anchor) {
  if (!anchor) {
    // Center of screen
    popover.style.cssText = 'left:50%;top:50%;transform:translate(-50%,-50%)';
    return;
  }
  const rect = anchor.getBoundingClientRect();
  const pw   = 220;
  const ph   = 280; // approx height

  let left = rect.left + rect.width / 2 - pw / 2;
  let top  = rect.top - ph - 8;

  // Flip below if too close to top
  if (top < 60) top = rect.bottom + 8;

  // Clamp to viewport
  left = Math.max(12, Math.min(left, window.innerWidth - pw - 12));
  top  = Math.max(60, Math.min(top, window.innerHeight - ph - 12));

  popover.style.cssText = `left:${left}px;top:${top}px;width:${pw}px`;
}

function closeSharePopover() {
  document.getElementById('share-popover-backdrop')?.remove();
  document.getElementById('share-popover')?.remove();
}

// ── Copy to clipboard ─────────────────────────────────────────
async function copyToClipboard(url, anchorBtn) {
  try {
    await navigator.clipboard.writeText(url);
    showToast('Link copied!', 'success');
    if (anchorBtn) flashShareBtn(anchorBtn);
  } catch {
    // Fallback: execCommand
    const input = document.createElement('input');
    input.value = url;
    input.style.cssText = 'position:fixed;top:-999px';
    document.body.appendChild(input);
    input.select();
    try { document.execCommand('copy'); showToast('Link copied!', 'success'); } catch {}
    input.remove();
    if (anchorBtn) flashShareBtn(anchorBtn);
  }
}

// ── Flash the share button green briefly ─────────────────────
function flashShareBtn(btn) {
  btn.classList.add('copied');
  setTimeout(() => btn.classList.remove('copied'), 800);
}

// Close share popover on page navigation
const _goToBeforeShare = window.goTo;
window.goTo = function(page) {
  closeSharePopover();
  _goToBeforeShare(page);
};

// ── Image Lightbox ──────────────────────────────────────────
function openLightbox(url) {
  const lb  = document.getElementById('imgLightbox');
  const img = document.getElementById('imgLightboxImg');
  img.src = url;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Swipe-down to close
  let startY = 0;
  lb._onTouchStart = e => { startY = e.touches[0].clientY; };
  lb._onTouchEnd   = e => { if (e.changedTouches[0].clientY - startY > 60) closeLightbox(); };
  lb.addEventListener('touchstart', lb._onTouchStart, { passive: true });
  lb.addEventListener('touchend',   lb._onTouchEnd,   { passive: true });

  // Keyboard close
  lb._onKey = e => { if (e.key === 'Escape') closeLightbox(); };
  document.addEventListener('keydown', lb._onKey);
}
function closeLightbox() {
  const lb = document.getElementById('imgLightbox');
  lb.classList.remove('open');
  document.body.style.overflow = '';
  lb.removeEventListener('touchstart', lb._onTouchStart);
  lb.removeEventListener('touchend',   lb._onTouchEnd);
  document.removeEventListener('keydown', lb._onKey);
  // Clear src after transition so there's no flash on next open
  setTimeout(() => { document.getElementById('imgLightboxImg').src = ''; }, 250);
}

// ── SCROLL REVEAL OBSERVER ───────────────────────────────
(function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  function attachReveal() {
    document.querySelectorAll('.reveal, .reveal-fade').forEach(el => {
      el.classList.remove('visible');
      obs.observe(el);
    });
  }
  const _goTo = window.goTo;
  window.goTo = function(page) { _goTo(page); setTimeout(attachReveal, 100); };
  setTimeout(attachReveal, 300);
})();

// ── HERO PARTICLE CANVAS ────────────────────────────────
(function initHeroParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];
  const GOLD = 'rgba(201,168,76,';
  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 28; i++) {
    particles.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height,
      r: Math.random()*1.5+0.5, vx: (Math.random()-.5)*.3, vy: -Math.random()*.4-.1,
      a: Math.random()*.5+.1, life: Math.random() });
  }
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life += 0.004;
      const alpha = p.a * Math.abs(Math.sin(p.life * Math.PI));
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = GOLD + alpha + ')'; ctx.fill();
      if (p.y < -5) p.y = canvas.height+5;
      if (p.x < -5) p.x = canvas.width+5;
      if (p.x > canvas.width+5) p.x = -5;
    });
    requestAnimationFrame(tick);
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) tick();
})();

// Fetch home events and discovery rows on load and start live listeners
fetchHomeEvents();
fetchDiscoveryRows();
startCommunityLive();

// ═══════════════════════════════════════════════════════════
// COMMUNITY REPLIES
// ═══════════════════════════════════════════════════════════

// Track which reply sections have been loaded to avoid re-fetching
const _repliesLoaded = new Set();

async function toggleReplies(postId, btn) {
  const section = document.getElementById(`reply-section-${postId}`);
  if (!section) return;
  const isOpen = section.classList.contains('open');
  if (isOpen) { section.classList.remove('open'); return; }
  section.classList.add('open');
  if (!_repliesLoaded.has(postId)) { await loadReplies(postId); }
  const input = document.getElementById(`reply-input-${postId}`);
  if (input) setTimeout(() => input.focus(), 150);
}

async function loadReplies(postId) {
  const list = document.getElementById(`reply-list-${postId}`);
  if (!list) return;
  list.innerHTML = '<div style="font-size:12px;color:var(--muted);padding:8px 0">Loading…</div>';
  try {
    const res  = await fetch(`${API_BASE}/api/community-posts/${postId}/replies`, {
      headers: currentSession?.access_token ? { 'Authorization': `Bearer ${currentSession.access_token}` } : {},
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load');
    _repliesLoaded.add(postId);
    renderReplies(postId, data.replies || []);
  } catch(e) {
    if (list) list.innerHTML = '<div style="font-size:12px;color:var(--red);padding:4px 0">Could not load replies.</div>';
  }
}

function renderReplies(postId, replies) {
  const list = document.getElementById(`reply-list-${postId}`);
  if (!list) return;
  list.innerHTML = '';
  if (replies.length === 0) {
    list.innerHTML = '<div style="font-size:12px;color:var(--muted);padding:4px 0 8px">No replies yet — be the first!</div>';
    return;
  }
  replies.forEach(r => list.appendChild(makeReplyEl(postId, r)));
}

function makeReplyEl(postId, r) {
  const el     = document.createElement('div');
  el.className = 'reply-row';
  el.dataset.replyId = r.id;
  const name    = r.profiles?.full_name || 'Anonymous';
  const initial = name.charAt(0).toUpperCase();
  const avBg    = r.profiles?.avatar_color || 'var(--gold)';
  const avUrl   = r.profiles?.avatar_url;
  const isOwn   = currentUser && r.author_id === currentUser.id;
  const time    = formatTimeAgo(r.created_at);
  const avInner = avUrl ? `<img alt="" src="${avUrl}" style="width:100%;height:100%;object-fit:cover">` : initial;
  el.innerHTML = `
    <div class="reply-av" style="background:${avUrl ? 'transparent' : avBg}">${avInner}</div>
    <div class="reply-body-wrap">
      <div class="reply-name">
        <span>${escapeHtml(name)}</span>
        <span class="reply-time">${time}</span>
      </div>
      <div class="reply-text">${escapeHtml(r.body)}</div>
      <div class="reply-actions">
        <button class="reply-amen-btn${r.has_amened ? ' active' : ''}" data-amened="${r.has_amened ? '1' : '0'}" onclick="amenReply('${r.id}', this)">
          <svg width="13" height="13" viewBox="0 0 32 32" fill="none" style="vertical-align:middle;margin-right:3px"><path d="M10 6 L10 18 C10 21 12.5 23 16 23 C19.5 23 22 21 22 18 L22 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M13 27 L16 23 L19 27" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${r.amen_count || 0}</span>
        </button>
        ${isOwn ? `<button class="reply-delete-btn" onclick="deleteReply('${postId}','${r.id}',this)">Delete</button>` : ''}
      </div>
    </div>`;
  return el;
}

async function submitReply(postId) {
  if (!currentUser) { openAuth('signup'); return; }
  const input = document.getElementById(`reply-input-${postId}`);
  if (!input) return;
  const body = input.value.trim();
  if (!body) return;
  const btn = document.querySelector(`#reply-input-wrap-${postId} .reply-submit-btn`);
  if (btn) { btn.disabled = true; btn.style.opacity = '0.6'; }
  try {
    const res  = await fetch(`${API_BASE}/api/community-posts/${postId}/replies`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
      body:    JSON.stringify({ body }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error || 'Failed to reply', 'error'); return; }
    input.value = '';
    input.style.height = 'auto';
    const list = document.getElementById(`reply-list-${postId}`);
    if (list) {
      if (list.querySelector('div[style*="No replies"]')) list.innerHTML = '';
      list.appendChild(makeReplyEl(postId, data));
    }
    updateReplyToggleBtn(postId, 1);
    showToast('Reply posted!', 'success');
  } catch(e) {
    showToast('Could not post reply. Try again.', 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
  }
}

async function amenReply(replyId, btn) {
  if (!currentUser) { openAuth('signup'); return; }
  btn.disabled = true;
  try {
    const res  = await fetch(`${API_BASE}/api/community-replies/${replyId}/amen`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    const data = await res.json();
    if (res.ok) {
      const countEl = btn.querySelector('span');
      if (countEl) countEl.textContent = data.amen_count;
      btn.dataset.amened = data.has_amened ? '1' : '0';
      btn.classList.toggle('active', data.has_amened);
    }
  } catch {}
  finally { btn.disabled = false; }
}

async function deleteReply(postId, replyId, btn) {
  if (!confirm('Delete this reply?')) return;
  btn.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/api/community-posts/${postId}/replies/${replyId}`, {
      method:  'DELETE',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    if (res.ok) {
      const row = document.querySelector(`.reply-row[data-reply-id="${replyId}"]`);
      if (row) row.remove();
      updateReplyToggleBtn(postId, -1);
      const list = document.getElementById(`reply-list-${postId}`);
      if (list && list.children.length === 0) {
        list.innerHTML = '<div style="font-size:12px;color:var(--muted);padding:4px 0 8px">No replies yet — be the first!</div>';
      }
      showToast('Reply deleted');
    } else {
      const d = await res.json().catch(() => ({}));
      showToast(d.error || 'Could not delete', 'error');
      btn.disabled = false;
    }
  } catch {
    showToast('Could not delete. Try again.', 'error');
    btn.disabled = false;
  }
}

function updateReplyToggleBtn(postId, delta) {
  const btn = document.getElementById(`reply-toggle-${postId}`);
  if (!btn) return;
  const match = btn.textContent.match(/(\d+)/);
  const current = match ? parseInt(match[1]) : 0;
  const newCount = Math.max(0, current + delta);
  if (newCount > 0) {
    btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 32 32" fill="none" style="vertical-align:middle;margin-right:4px"><path d="M5 6 C5 5 6 4 7 4 L22 4 C23 4 24 5 24 6 L24 16 C24 17 23 18 22 18 L14 18 L9 23 L9 18 L7 18 C6 18 5 17 5 16 Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>${newCount} repl${newCount === 1 ? 'y' : 'ies'}`;
    btn.classList.add('has-replies');
  } else {
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 32 32" fill="none" style="vertical-align:middle;margin-right:4px"><path d="M5 6 C5 5 6 4 7 4 L22 4 C23 4 24 5 24 6 L24 16 C24 17 23 18 22 18 L14 18 L9 23 L9 18 L7 18 C6 18 5 17 5 16 Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>Reply';
    btn.classList.remove('has-replies');
  }
}

// ═══════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════
let _adminLoaded = {};
let _adminCharts = {};
let _adminUserDebounce;

function syncAdminNav() {
  const link = document.getElementById('dd-admin-link');
  if (link) link.style.display = profileData?.role === 'admin' ? 'flex' : 'none';
}

function switchAdminTab(tab, btn) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(`admin-panel-${tab}`).classList.add('active');
  loadAdminPanel(tab);
}

function loadAdminPanel(tab) {
  if (tab === 'community')     { loadAdminCommunityPosts(); return; }
  if (tab === 'promos')        { loadAdminPromoCodes(); return; }
  if (tab === 'verifications') { loadAdminVerifications('pending'); return; }
  if (_adminLoaded[tab]) return;
  _adminLoaded[tab] = true;
  switch(tab) {
    case 'overview':  loadAdminOverview();  break;
    case 'revenue':   loadAdminRevenue();   break;
    case 'events':    loadAdminEvents();    break;
    case 'users':     loadAdminUsers();     break;
    case 'activity':  loadAdminActivity();  break;
    case 'manage':    loadAdminUsers();     break;
  }
}

function adminHeaders() {
  return { 'Authorization': `Bearer ${currentSession?.access_token}` };
}

async function loadAdminCommunityPosts() {
  const list = document.getElementById('adminPostsList');
  if (!list) return;
  list.innerHTML = '<div style="text-align:center;padding:30px;color:var(--muted2);font-size:14px"><div class="spinner spinner-gold" style="margin:0 auto 10px"></div>Loading…</div>';
  try {
    const res = await fetch(`${API_BASE}/api/admin/posts`, {
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` }
    });
    const data = await res.json();
    const posts = data.posts || [];
    if (!posts.length) {
      list.innerHTML = '<div style="text-align:center;padding:30px;color:var(--muted2);font-size:14px">No posts yet.</div>';
      return;
    }
    list.innerHTML = posts.map(p => `
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-md);padding:14px;display:flex;gap:12px;align-items:flex-start">
        <input type="checkbox" class="admin-post-check" data-id="${p.id}" onchange="adminPostCheckChange()" style="margin-top:3px;accent-color:var(--gold);flex-shrink:0">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <div style="font-size:13px;font-weight:600;color:var(--text)">${escapeHtml(p.profiles?.full_name || 'Unknown')}</div>
            <div style="font-size:11px;color:var(--muted2)">${formatTimeAgo(p.created_at)}</div>
          </div>
          <div style="font-size:13px;color:var(--muted2);line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical">${escapeHtml(p.body || '')}</div>
        </div>
      </div>`).join('');
  } catch(e) {
    list.innerHTML = '<div style="text-align:center;padding:30px;color:var(--red);font-size:13px">Failed to load posts.</div>';
  }
}

function adminPostCheckChange() {
  const checks = document.querySelectorAll('.admin-post-check:checked');
  const btn = document.getElementById('adminDelPostsBtn');
  if (btn) btn.style.display = checks.length > 0 ? 'block' : 'none';
}

function adminToggleSelectAllPosts(checked) {
  document.querySelectorAll('.admin-post-check').forEach(c => { c.checked = checked; });
  adminPostCheckChange();
}

async function adminDeleteSelectedPosts() {
  const checks = [...document.querySelectorAll('.admin-post-check:checked')];
  if (!checks.length) return;
  if (!confirm(`Delete ${checks.length} post${checks.length > 1 ? 's' : ''}?`)) return;
  const btn = document.getElementById('adminDelPostsBtn');
  btn.disabled = true; btn.textContent = 'Deleting…';
  let failed = 0;
  for (const c of checks) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/posts/${c.dataset.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentSession?.access_token}` }
      });
      if (!res.ok) failed++;
    } catch { failed++; }
  }
  btn.disabled = false;
  showToast(failed ? `Deleted with ${failed} error(s).` : 'Posts deleted.', failed ? 'error' : 'success');
  loadAdminCommunityPosts();
}

// ─── LISTING PROMO CODES (admin) ───────────────────────────
async function loadAdminPromoCodes() {
  const list = document.getElementById('adminPromoList');
  if (!list) return;
  list.innerHTML = '<div style="text-align:center;padding:30px;color:var(--muted2);font-size:14px"><div class="spinner spinner-gold" style="margin:0 auto 10px"></div>Loading…</div>';
  try {
    const res = await fetch(`${API_BASE}/api/admin/listing-promo-codes`, { headers: adminHeaders() });
    const data = await res.json();
    const codes = data.codes || [];
    if (!codes.length) {
      list.innerHTML = '<div style="text-align:center;padding:30px;color:var(--muted2);font-size:14px">No promo codes yet.</div>';
      return;
    }
    list.innerHTML = codes.map(c => {
      const discountLabel = c.discount_type === 'percent' ? `${c.discount_value}% off` : `$${parseFloat(c.discount_value).toFixed(2)} off`;
      const usageLabel   = c.max_uses ? `${c.uses_count}/${c.max_uses} uses` : `${c.uses_count} uses`;
      const expiredLabel = c.expires_at && new Date(c.expires_at) < new Date() ? ' · <span style="color:#ef4444">Expired</span>' : (c.expires_at ? ` · Exp ${new Date(c.expires_at).toLocaleDateString()}` : '');
      const statusColor  = c.active ? '#22c55e' : '#ef4444';
      const statusLabel  = c.active ? 'Active' : 'Inactive';
      return `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span style="font-size:15px;font-weight:700;color:var(--gold);letter-spacing:.04em">${escapeHtml(c.code)}</span>
            <span style="font-size:11px;font-weight:600;color:${statusColor};background:${statusColor}22;border-radius:20px;padding:2px 8px">${statusLabel}</span>
          </div>
          <div style="font-size:12px;color:var(--muted2)">${discountLabel} · ${usageLabel}${expiredLabel}</div>
        </div>
        <button onclick="adminTogglePromo('${c.id}',${!c.active})" style="background:${c.active ? '#ef4444' : 'var(--gold)'};color:${c.active ? '#fff' : '#0a0a0f'};border:none;border-radius:8px;padding:7px 12px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap">${c.active ? 'Deactivate' : 'Activate'}</button>
      </div>`;
    }).join('');
  } catch(e) {
    list.innerHTML = `<div style="text-align:center;padding:20px;color:#ef4444;font-size:14px">${escapeHtml(e.message)}</div>`;
  }
}

function adminPromoTypeChange() {
  const type = document.getElementById('promoType').value;
  const lbl  = document.getElementById('promoValueLabel');
  const inp  = document.getElementById('promoValue');
  if (type === 'percent') { lbl.textContent = 'Discount %'; inp.max = 100; inp.placeholder = '50'; }
  else { lbl.textContent = 'Discount $'; inp.removeAttribute('max'); inp.placeholder = '5.00'; }
}

async function adminCreatePromoCode() {
  const errEl = document.getElementById('promoCreateErr');
  errEl.classList.remove('show');
  const code  = document.getElementById('promoCode').value.trim().toUpperCase();
  const type  = document.getElementById('promoType').value;
  const value = document.getElementById('promoValue').value.trim();
  const maxU  = document.getElementById('promoMaxUses').value.trim();
  const exp   = document.getElementById('promoExpiry').value;
  if (!code)  { errEl.textContent = 'Code is required.'; errEl.classList.add('show'); return; }
  if (!value) { errEl.textContent = 'Discount value is required.'; errEl.classList.add('show'); return; }
  try {
    const res = await fetch(`${API_BASE}/api/admin/listing-promo-codes`, {
      method: 'POST',
      headers: { ...adminHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, discount_type: type, discount_value: value, max_uses: maxU || null, expires_at: exp || null }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create code.');
    // clear form
    ['promoCode','promoValue','promoMaxUses','promoExpiry'].forEach(id => document.getElementById(id).value = '');
    showToast('Promo code created!', 'success');
    loadAdminPromoCodes();
  } catch(e) {
    errEl.textContent = e.message; errEl.classList.add('show');
  }
}

async function adminTogglePromo(id, active) {
  try {
    await fetch(`${API_BASE}/api/admin/listing-promo-codes/${id}`, {
      method: 'PATCH',
      headers: { ...adminHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
    loadAdminPromoCodes();
  } catch(e) { showToast(e.message, 'error'); }
}

// ─── LISTING PROMO (host side — fee sheet) ─────────────────
let _listingPromoId = null;
let _listingPromoDiscount = 0; // cents

async function applyListingPromo() {
  const code  = document.getElementById('lfPromoInput').value.trim();
  const msgEl = document.getElementById('lfPromoMsg');
  const errEl = document.getElementById('lfErr');
  msgEl.style.display = 'none';
  errEl.classList.remove('show');
  if (!code) return;
  try {
    const res = await fetch(`${API_BASE}/api/validate-listing-promo`, {
      method: 'POST',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid code.');
    _listingPromoId = data.promo_id;
    _listingPromoDiscount = data.discount_cents;
    const finalDollars = (data.final_cents / 100).toFixed(2);
    const discLabel = data.discount_type === 'percent' ? `${data.discount_value}% off` : `$${(data.discount_cents/100).toFixed(2)} off`;
    msgEl.textContent = `✓ ${discLabel} applied — you pay $${finalDollars}`;
    msgEl.style.display = 'block';
    const payBtn = document.getElementById('lfPayBtn');
    payBtn.textContent = data.final_cents === 0 ? 'Publish Free →' : `Pay $${finalDollars} →`;
  } catch(e) {
    _listingPromoId = null; _listingPromoDiscount = 0;
    errEl.textContent = e.message; errEl.classList.add('show');
  }
}

async function loadAdminOverview() {
  try {
    const [ovRes, sigRes] = await Promise.all([
      fetch(`${API_BASE}/api/admin/overview`, { headers: adminHeaders() }),
      fetch(`${API_BASE}/api/admin/signups`,  { headers: adminHeaders() }),
    ]);
    const ov  = await ovRes.json();
    const sig = await sigRes.json();
    const grid = document.getElementById('adminStatGrid');
    grid.innerHTML = '';
    const stats = [
      { label: 'Total Members',    value: fmtNum(ov.total_users),           sub: `+${ov.new_users_week} this week`, color: 'green', badge: ov.new_users_week > 0 ? `+${ov.new_users_week} ↑` : null },
      { label: 'Total Hosts',      value: fmtNum(ov.total_hosts),           sub: 'Verified hosts',   color: '' },
      { label: 'Live Events',      value: fmtNum(ov.published_events),      sub: `${ov.draft_events} drafts`, color: 'gold' },
      { label: 'Tickets Sold',     value: fmtNum(ov.total_tickets_sold),    sub: 'All time',         color: '' },
      { label: 'Platform Revenue', value: fmtMoney(ov.total_platform_fees), sub: 'Your earnings',    color: 'gold' },
      { label: 'Gross Revenue',    value: fmtMoney(ov.total_gross_revenue), sub: 'Total processed',  color: '' },
      { label: 'Listing Fees',     value: fmtMoney(ov.listing_fees_collected), sub: '$19.99 per paid event', color: '' },
      { label: 'Community Posts',  value: fmtNum(ov.total_posts),           sub: 'All time',         color: 'purple' },
    ];
    stats.forEach(s => {
      const card = document.createElement('div');
      card.className = `admin-stat-card ${s.color}`;
      card.innerHTML = `
        <div class="admin-stat-label">${s.label}</div>
        <div class="admin-stat-value">${s.value}</div>
        <div class="admin-stat-sub">${s.sub}</div>
        ${s.badge ? `<div class="admin-stat-badge up">${s.badge}</div>` : ''}`;
      grid.appendChild(card);
    });
    drawLineChart('signupsChart', sig.data || [], 'day', 'count', '#4EC98C', 'New Members');
  } catch(e) {
    console.error('[admin overview]', e);
    document.getElementById('adminStatGrid').innerHTML =
      `<div style="grid-column:1/-1;color:var(--red);padding:20px;font-size:13px">Failed to load: ${escapeHtml(e.message)}</div>`;
  }
}

async function loadAdminRevenue() {
  try {
    const [revRes, typeRes] = await Promise.all([
      fetch(`${API_BASE}/api/admin/revenue`,        { headers: adminHeaders() }),
      fetch(`${API_BASE}/api/admin/events-by-type`, { headers: adminHeaders() }),
    ]);
    const rev  = await revRes.json();
    const type = await typeRes.json();
    const statsEl  = document.getElementById('adminRevenueStats');
    const revData  = rev.data || [];
    const totalFees  = revData.reduce((s, d) => s + Number(d.platform_fees || 0), 0);
    const totalGross = revData.reduce((s, d) => s + Number(d.gross_revenue  || 0), 0);
    const totalTix   = revData.reduce((s, d) => s + Number(d.ticket_count   || 0), 0);
    statsEl.innerHTML = `
      <div class="admin-stat-card gold">
        <div class="admin-stat-label">Platform Fees (30d)</div>
        <div class="admin-stat-value">${fmtMoney(totalFees)}</div>
        <div class="admin-stat-sub">Your earnings</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-label">Gross Revenue (30d)</div>
        <div class="admin-stat-value">${fmtMoney(totalGross)}</div>
        <div class="admin-stat-sub">Total processed</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-label">Tickets Sold (30d)</div>
        <div class="admin-stat-value">${fmtNum(totalTix)}</div>
        <div class="admin-stat-sub">Paid tickets</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-label">Avg Fee / Day</div>
        <div class="admin-stat-value">${fmtMoney(revData.length ? totalFees / revData.length : 0)}</div>
        <div class="admin-stat-sub">Platform average</div>
      </div>`;
    drawLineChart('revenueChart', revData, 'day', 'platform_fees', '#C9A84C', 'Platform Fees ($)', true);
    drawBarChart('eventTypeChart', type.data || [], 'event_type', 'count', '#A882FF');
  } catch(e) {
    console.error('[admin revenue]', e);
  }
}

async function loadAdminEvents() {
  try {
    const res    = await fetch(`${API_BASE}/api/admin/top-events`, { headers: adminHeaders() });
    const data   = await res.json();
    const events = data.events || [];
    const wrap   = document.getElementById('adminTopEventsTable');
    if (!events.length) {
      wrap.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:20px 0">No published events yet.</div>';
      return;
    }
    wrap.innerHTML = `
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead><tr>
            <th>Event</th><th>Host</th><th>Date</th>
            <th>RSVPs</th><th>Tickets</th><th>Fees</th><th></th>
          </tr></thead>
          <tbody>
            ${events.map(e => `
              <tr>
                <td>
                  <div style="font-weight:600;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(e.name)}</div>
                  <div style="font-size:11px;color:var(--muted)">${escapeHtml(e.city || '')} · ${e.is_paid ? 'Paid' : 'Free'}</div>
                </td>
                <td style="font-size:12px;color:var(--muted2)">${escapeHtml(e.host_name || '—')}</td>
                <td style="font-size:12px;white-space:nowrap">${e.start_date ? new Date(e.start_date).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : '—'}</td>
                <td style="text-align:right;font-weight:600">${e.rsvp_count}</td>
                <td style="text-align:right;font-weight:600">${e.ticket_count}</td>
                <td style="text-align:right;color:var(--gold);font-weight:600">${fmtMoney(e.platform_fees)}</td>
                <td>
                  <div style="display:flex;gap:6px">
                    <button class="admin-action-btn view" onclick="adminViewEvent('${e.id}')">View</button>
                    <button class="admin-action-btn danger" onclick="adminCancelEvent('${e.id}',this)">Cancel</button>
                  </div>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  } catch(e) {
    console.error('[admin events]', e);
  }
}

async function loadAdminUsers() {
  if (!_adminLoaded['users-hosts']) {
    _adminLoaded['users-hosts'] = true;
    try {
      const res   = await fetch(`${API_BASE}/api/admin/top-hosts`, { headers: adminHeaders() });
      const data  = await res.json();
      const hosts = data.hosts || [];
      const wrap  = document.getElementById('adminTopHostsTable');
      if (wrap) {
        wrap.innerHTML = hosts.length ? `
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead><tr><th>Host</th><th>City</th><th>Events</th><th>Fees Gen.</th><th>Joined</th></tr></thead>
              <tbody>
                ${hosts.map(h => `
                  <tr>
                    <td>
                      <div style="font-weight:600">${escapeHtml(h.full_name || '—')}</div>
                      <div style="font-size:11px;color:var(--muted)">${escapeHtml(h.email || '')}</div>
                    </td>
                    <td style="font-size:12px;color:var(--muted2)">${escapeHtml(h.city || '—')}</td>
                    <td style="text-align:right;font-weight:600">${h.event_count}</td>
                    <td style="text-align:right;color:var(--gold);font-weight:600">${fmtMoney(h.platform_fees_generated)}</td>
                    <td style="font-size:11px;color:var(--muted)">${new Date(h.created_at).toLocaleDateString('en-US',{month:'short',year:'numeric'})}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>` : '<div style="color:var(--muted);font-size:13px;padding:20px 0">No hosts yet.</div>';
      }
    } catch(e) { console.error('[admin users]', e); }
  }
  const q    = document.getElementById('adminUserSearch')?.value.trim() || '';
  const role = document.getElementById('adminRoleFilter')?.value || '';
  const wrap = document.getElementById('adminUserTable');
  if (!wrap) return;
  wrap.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:16px 0">Loading…</div>';
  try {
    const params = new URLSearchParams({ limit: '30' });
    if (q)    params.set('q', q);
    if (role) params.set('role', role);
    const res   = await fetch(`${API_BASE}/api/admin/users?${params}`, { headers: adminHeaders() });
    const data  = await res.json();
    const users = data.users || [];
    wrap.innerHTML = users.length ? `
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead><tr><th>User</th><th>Role</th><th>City</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>
                  <div style="font-weight:600">${escapeHtml(u.full_name || '—')}</div>
                  <div style="font-size:11px;color:var(--muted)">${escapeHtml(u.email || '')}</div>
                </td>
                <td><span class="role-badge ${u.role}">${u.role}</span></td>
                <td style="font-size:12px;color:var(--muted2)">${escapeHtml(u.city || '—')}</td>
                <td style="font-size:11px;color:var(--muted)">${new Date(u.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
                <td>
                  <div style="display:flex;gap:6px;flex-wrap:wrap">
                    <button class="admin-action-btn view" onclick="openPublicProfile('${u.id}')">View</button>
                    ${u.role === 'attendee' ? `<button class="admin-action-btn promote" onclick="adminSetRole('${u.id}','host',this)">→ Host</button>` : ''}
                    ${u.role === 'host'     ? `<button class="admin-action-btn demote"  onclick="adminSetRole('${u.id}','attendee',this)">→ Attendee</button>` : ''}
                    ${u.role !== 'admin'   ? `<button class="admin-action-btn promote" onclick="adminSetRole('${u.id}','admin',this)" style="background:rgba(201,168,76,.1);color:var(--gold);border-color:rgba(201,168,76,.3)">→ Admin</button>` : ''}
                    ${u.stripe_account_id  ? `<button class="admin-action-btn demote"  onclick="adminResetStripe('${u.id}',this)" style="background:rgba(239,68,68,.08);color:#ef4444;border-color:rgba(239,68,68,.3)">Reset Stripe</button>` : ''}
                  </div>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>` : '<div style="color:var(--muted);font-size:13px;padding:20px 0">No users found.</div>';
  } catch(e) {
    wrap.innerHTML = `<div style="color:var(--red);font-size:13px;padding:16px 0">Error: ${escapeHtml(e.message)}</div>`;
  }
}

function debounceAdminUserSearch() {
  clearTimeout(_adminUserDebounce);
  _adminUserDebounce = setTimeout(loadAdminUsers, 350);
}

async function loadAdminActivity() {
  const wrap = document.getElementById('adminActivityFeed');
  wrap.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:16px 0">Loading…</div>';
  try {
    const res   = await fetch(`${API_BASE}/api/admin/activity`, { headers: adminHeaders() });
    const data  = await res.json();
    const items = data.activity || [];
    wrap.innerHTML = items.length ? items.map(item => `
      <div class="admin-activity-item">
        <div class="admin-activity-icon" style="background:${item.color}22;color:${item.color}">${item.icon}</div>
        <div>
          <div class="admin-activity-text">${escapeHtml(item.text)}</div>
          ${item.sub ? `<div class="admin-activity-sub">${escapeHtml(item.sub)}</div>` : ''}
          <div class="admin-activity-time">${formatTimeAgo(item.time)}</div>
        </div>
      </div>`).join('') : '<div style="color:var(--muted);font-size:13px;padding:20px 0">No activity yet.</div>';
  } catch(e) {
    wrap.innerHTML = `<div style="color:var(--red);font-size:13px">Error: ${escapeHtml(e.message)}</div>`;
  }
}

async function adminSetRole(userId, role, btn) {
  if (!confirm(`Set this user's role to "${role}"?`)) return;
  btn.disabled = true; btn.textContent = '…';
  try {
    const res = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...adminHeaders() },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      showToast(`Role updated to ${role}`, 'success');
      _adminLoaded = {};
      loadAdminUsers();
    } else {
      const d = await res.json();
      showToast(d.error || 'Failed', 'error');
      btn.disabled = false; btn.textContent = `→ ${role}`;
    }
  } catch { btn.disabled = false; showToast('Failed', 'error'); }
}

async function adminResetStripe(userId, btn) {
  if (!confirm('Disconnect this user\'s Stripe Connect account? They will need to re-onboard.')) return;
  btn.disabled = true; btn.textContent = '…';
  try {
    const res = await fetch(`${API_BASE}/api/admin/connect-disconnect/${userId}`, {
      method: 'DELETE',
      headers: adminHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset Stripe.');
    showToast('Stripe account disconnected for user.', 'success');
    _adminLoaded['manage'] = false;
    loadAdminUsers();
  } catch(e) {
    showToast(e.message, 'error');
    btn.disabled = false; btn.textContent = 'Reset Stripe';
  }
}

function adminViewEvent(id) {
  closeSharePopover?.();
  fetch(`${API_BASE}/api/events/${id}`)
    .then(r => r.json())
    .then(ev => { viewDetail(ev); goTo('event-detail'); })
    .catch(() => showToast('Could not load event', 'error'));
}

async function adminCancelEvent(id, btn) {
  if (!confirm('Cancel this event? Attendees will no longer see it as active.')) return;
  btn.disabled = true; btn.textContent = '…';
  try {
    const res = await fetch(`${API_BASE}/api/admin/events/${id}/cancel`, {
      method: 'PATCH', headers: adminHeaders(),
    });
    if (res.ok) {
      showToast('Event cancelled', 'success');
      btn.textContent = 'Cancelled';
      btn.style.color = 'var(--muted)';
      _adminLoaded = {};
    } else {
      btn.disabled = false; btn.textContent = 'Cancel';
      showToast('Failed to cancel', 'error');
    }
  } catch { btn.disabled = false; btn.textContent = 'Cancel'; }
}

function drawLineChart(canvasId, data, xKey, yKey, color, label, isMoney = false) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  if (_adminCharts[canvasId]) { _adminCharts[canvasId].destroy(); }
  const today = new Date();
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0,10));
  }
  const lookup = Object.fromEntries((data || []).map(d => [d[xKey]?.slice(0,10), d[yKey]]));
  const values = days.map(d => Number(lookup[d] || 0) / (isMoney ? 100 : 1));
  const labels = days.map(d => new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric' }));
  _adminCharts[canvasId] = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label,
        data: values,
        borderColor: color,
        backgroundColor: color + '18',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
        tension: 0.4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => isMoney ? `$${ctx.parsed.y.toFixed(2)}` : ctx.parsed.y } },
      },
      scales: {
        x: { ticks: { color: '#666070', font: { size: 10 }, maxTicksLimit: 7 }, grid: { color: 'rgba(255,255,255,.04)' } },
        y: {
          ticks: { color: '#666070', font: { size: 10 }, callback: v => isMoney ? `$${v}` : v },
          grid: { color: 'rgba(255,255,255,.04)' },
          beginAtZero: true,
        },
      },
    },
  });
}

function drawBarChart(canvasId, data, xKey, yKey, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  if (_adminCharts[canvasId]) { _adminCharts[canvasId].destroy(); }
  _adminCharts[canvasId] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: data.map(d => d[xKey]),
      datasets: [{
        data: data.map(d => Number(d[yKey])),
        backgroundColor: color + 'CC',
        borderColor: color,
        borderWidth: 1,
        borderRadius: 4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#666070', font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: '#666070', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,.04)' }, beginAtZero: true },
      },
    },
  });
}

function fmtNum(n) { return Number(n || 0).toLocaleString(); }
function fmtMoney(cents) {
  const dollars = Number(cents || 0) / 100;
  if (dollars >= 1000) return `$${(dollars/1000).toFixed(1)}k`;
  return `$${dollars.toFixed(2)}`;
}

// Hook into goTo for admin page — stacks on existing wrappers safely
const _goToBeforeAdmin = window.goTo;
window.goTo = function(page) {
  _goToBeforeAdmin(page);
  if (page === 'admin') {
    if (profileData?.role !== 'admin') {
      goTo('profile');
      showToast('Admin access required.', 'error');
      return;
    }
    if (!_adminLoaded['overview']) loadAdminPanel('overview');
    document.getElementById('tabbar').style.display = 'none';
  }
};


// ── EVENT SALES ──────────────────────────────────────────────
async function openEventSales(eventId) {
  document.getElementById('salesEventName').textContent = 'Loading…';
  document.getElementById('salesSummaryCards').innerHTML = '';
  document.getElementById('salesTicketList').innerHTML =
    '<div style="color:var(--muted);font-size:13px;padding:16px 0">Loading…</div>';
  document.getElementById('salesRsvpSection').style.display = 'none';
  document.getElementById('salesRefundSection').style.display = 'none';
  document.getElementById('eventSalesSheet').classList.add('open');
  document.body.style.overflow = 'hidden';
  try {
    const [res, refundRes] = await Promise.all([
      fetch(`${API_BASE}/api/events/${eventId}/sales`, {
        headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
      }),
      fetch(`${API_BASE}/api/refund-requests?eventId=${eventId}`, {
        headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
      }),
    ]);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load sales');
    const { requests: refundRequests = [] } = refundRes.ok ? await refundRes.json() : {};
    const { event: ev, tickets, rsvps, summary } = data;
    document.getElementById('salesEventName').textContent = ev.name;
    const cards = [
      { label: 'Tickets Sold',   value: summary.totalTicketsSold, color: 'var(--gold)' },
      { label: 'Free RSVPs',     value: summary.totalRsvps,       color: 'var(--green)' },
      { label: 'Gross Revenue',  value: `$${(summary.grossRevenue/100).toFixed(2)}`,  color: 'var(--gold)' },
      { label: 'Your Earnings',  value: `$${(summary.hostEarnings/100).toFixed(2)}`,  color: 'var(--green)' },
    ];
    document.getElementById('salesSummaryCards').innerHTML = cards.map(c => `
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-md);padding:14px">
        <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px">${c.label}</div>
        <div style="font-family:var(--font-display);font-size:20px;font-weight:700;color:${c.color}">${c.value}</div>
      </div>`).join('');
    const confirmed = tickets.filter(t => t.status === 'confirmed');
    if (confirmed.length === 0) {
      document.getElementById('salesTicketList').innerHTML =
        '<div style="color:var(--muted);font-size:13px;padding:12px 0">No ticket sales yet.</div>';
    } else {
      document.getElementById('salesTicketList').innerHTML = confirmed.map(t => {
        const name    = t.profiles?.full_name || t.buyer_email || 'Unknown';
        const initial = name.charAt(0).toUpperCase();
        const avBg    = t.profiles?.avatar_color || 'var(--gold)';
        const date    = t.confirmed_at
          ? new Date(t.confirmed_at).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})
          : '—';
        return `
          <div style="padding:11px 0;border-bottom:1px solid var(--border)">
            <div style="display:flex;align-items:center;gap:12px">
              <div style="width:36px;height:36px;border-radius:50%;background:${avBg};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#000;flex-shrink:0;overflow:hidden">
                ${t.profiles?.avatar_url ? `<img alt="" src="${t.profiles.avatar_url}" style="width:100%;height:100%;object-fit:cover">` : initial}
              </div>
              <div style="flex:1;min-width:0">
                <div style="font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(name)}</div>
                <div style="font-size:11px;color:var(--muted2)">${escapeHtml(t.ticket_types?.name || 'Ticket')} · ${t.quantity}x · ${date}</div>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <div style="font-size:14px;font-weight:700;color:var(--gold)">$${((t.total_charged_cents||0)/100).toFixed(2)}</div>
                <div style="font-size:10px;color:var(--muted);font-family:monospace">${t.code || '—'}</div>
              </div>
            </div>
            <div style="margin-top:8px;display:flex;gap:8px">
              <button onclick="hostIssueRefund('${t.id}',this)" style="padding:5px 14px;background:rgba(239,68,68,.07);color:#ef4444;border:1px solid rgba(239,68,68,.2);border-radius:var(--r-full);font-size:12px;font-weight:600;cursor:pointer">Refund</button>
            </div>
          </div>`;
      }).join('');
    }
    if (rsvps.length > 0) {
      document.getElementById('salesRsvpSection').style.display = 'block';
      document.getElementById('salesRsvpList').innerHTML = rsvps.map(r => {
        const name    = r.profiles?.full_name || r.profiles?.email || 'Member';
        const initial = name.charAt(0).toUpperCase();
        const avBg    = r.profiles?.avatar_color || 'var(--gold)';
        const date    = new Date(r.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric'});
        return `
          <div style="display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--border)">
            <div style="width:36px;height:36px;border-radius:50%;background:${avBg};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#000;flex-shrink:0;overflow:hidden">
              ${r.profiles?.avatar_url ? `<img alt="" src="${r.profiles.avatar_url}" style="width:100%;height:100%;object-fit:cover">` : initial}
            </div>
            <div style="flex:1">
              <div style="font-size:14px;font-weight:600">${escapeHtml(name)}</div>
              <div style="font-size:11px;color:var(--muted2)">RSVP'd ${date}</div>
            </div>
            <div style="font-size:12px;font-weight:700;color:var(--green)"><svg width="11" height="11" viewBox="0 0 14 14" fill="none" style="vertical-align:middle;margin-right:2px"><path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Going</div>
          </div>`;
      }).join('');
    }

    // Refund requests section
    const pending = refundRequests.filter(r => r.status === 'pending');
    const resolved = refundRequests.filter(r => r.status !== 'pending');
    if (refundRequests.length > 0) {
      document.getElementById('salesRefundSection').style.display = 'block';
      if (pending.length > 0) {
        document.getElementById('salesRefundBadge').textContent = `${pending.length} pending`;
        document.getElementById('salesRefundBadge').style.display = '';
      } else {
        document.getElementById('salesRefundBadge').style.display = 'none';
      }
      document.getElementById('salesRefundList').innerHTML = [
        ...pending.map(r => renderSalesRefundRow(r, false)),
        ...resolved.map(r => renderSalesRefundRow(r, true)),
      ].join('');
    }
  } catch(e) {
    document.getElementById('salesTicketList').innerHTML =
      `<div style="color:var(--red);font-size:13px;padding:12px 0">${escapeHtml(e.message)}</div>`;
  }
}

async function hostIssueRefund(ticketId, btn) {
  if (!confirm('Refund this ticket? The full amount will be returned to the buyer immediately.')) return;
  btn.disabled = true; btn.textContent = 'Processing…';
  try {
    const res = await fetch(`${API_BASE}/api/tickets/${ticketId}/refund`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Refund failed');
    showToast('Refund issued', 'success');
    btn.textContent = 'Refunded';
    btn.style.color = 'var(--muted)';
    btn.style.borderColor = 'var(--border)';
    btn.style.background = 'none';
    btn.disabled = true;
  } catch (e) {
    showToast(e.message, 'error');
    btn.disabled = false; btn.textContent = 'Refund';
  }
}

function renderSalesRefundRow(r, isResolved) {
  const name    = r.profiles?.full_name || r.tickets?.buyer_email || 'Guest';
  const initial = name.charAt(0).toUpperCase();
  const avBg    = r.profiles?.avatar_color || 'var(--gold)';
  const amt     = r.tickets?.total_charged_cents
    ? `$${(r.tickets.total_charged_cents / 100).toFixed(2)}`
    : 'Free';
  const date    = new Date(r.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric'});
  const statusBadge = isResolved
    ? `<span style="font-size:11px;font-weight:700;color:${r.status==='approved'?'#4EC98C':'#ef4444'};background:${r.status==='approved'?'rgba(78,201,140,.1)':'rgba(239,68,68,.07)'};border:1px solid ${r.status==='approved'?'rgba(78,201,140,.3)':'rgba(239,68,68,.2)'};border-radius:999px;padding:2px 10px;text-transform:capitalize">${r.status}</span>`
    : '';
  return `
    <div style="padding:12px 0;border-bottom:1px solid var(--border);${isResolved?'opacity:.6':''}">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:36px;height:36px;border-radius:50%;background:${avBg};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#000;flex-shrink:0;overflow:hidden">
          ${r.profiles?.avatar_url ? `<img alt="" src="${r.profiles.avatar_url}" style="width:100%;height:100%;object-fit:cover">` : initial}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:600">${escapeHtml(name)}</div>
          <div style="font-size:11px;color:var(--muted2)">Ticket ${r.tickets?.code || '—'} · ${amt} · ${date}</div>
          ${r.reason ? `<div style="font-size:12px;color:var(--muted2);margin-top:3px;font-style:italic">"${escapeHtml(r.reason)}"</div>` : ''}
        </div>
        ${statusBadge}
      </div>
      ${!isResolved ? `
      <div style="display:flex;gap:8px;margin-top:10px">
        <button onclick="salesHandleRefund('${r.id}','approve',this)"
          style="padding:6px 18px;background:rgba(78,201,140,.1);color:#4EC98C;border:1px solid rgba(78,201,140,.3);border-radius:var(--r-full);font-size:13px;font-weight:600;cursor:pointer">
          Approve
        </button>
        <button onclick="salesHandleRefund('${r.id}','deny',this)"
          style="padding:6px 18px;background:rgba(239,68,68,.07);color:#ef4444;border:1px solid rgba(239,68,68,.2);border-radius:var(--r-full);font-size:13px;font-weight:600;cursor:pointer">
          Deny
        </button>
      </div>` : ''}
    </div>`;
}

async function salesHandleRefund(requestId, action, btn) {
  btn.disabled = true;
  btn.textContent = action === 'approve' ? 'Processing…' : 'Denying…';
  try {
    const res = await fetch(`${API_BASE}/api/refund-requests/${requestId}/${action}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    showToast(action === 'approve' ? 'Refund issued' : 'Request denied', 'success');
    // Update row in place
    const row = btn.closest('div[style*="border-bottom"]');
    if (row) {
      const btnRow = btn.parentElement;
      btnRow.innerHTML = `<span style="font-size:12px;font-weight:700;color:${action==='approve'?'#4EC98C':'#ef4444'}">${action === 'approve' ? '<svg width="11" height="11" viewBox="0 0 14 14" fill="none" style="vertical-align:middle;margin-right:3px"><path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Approved & Refunded' : '<svg width="11" height="11" viewBox="0 0 14 14" fill="none" style="vertical-align:middle;margin-right:3px"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Denied'}</span>`;
      row.style.opacity = '0.6';
    }
    // Update pending badge
    const badge = document.getElementById('salesRefundBadge');
    if (badge) {
      const pendingCount = document.querySelectorAll('#salesRefundList [onclick*="salesHandleRefund"]').length;
      if (pendingCount === 0) badge.style.display = 'none';
      else badge.textContent = `${Math.ceil(pendingCount/2)} pending`;
    }
  } catch (e) {
    showToast(e.message, 'error');
    btn.disabled = false;
    btn.textContent = action === 'approve' ? 'Approve' : 'Deny';
  }
}

// ── COUPON BUILDER ────────────────────────────────────────────
let couponRows = [];
function addCouponRow() {
  const id  = Date.now();
  couponRows.push(id);
  const builder = document.getElementById('couponBuilder');
  if (!builder) return;
  const row = document.createElement('div');
  row.id = `coupon-row-${id}`;
  row.style.cssText = 'background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-md);padding:14px;margin-bottom:10px';
  row.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 90px 80px 32px;gap:8px;align-items:end">
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">Code</div>
        <input type="text" placeholder="SAVE20" maxlength="20" autocapitalize="characters"
          style="width:100%;background:var(--surface3);border:1px solid var(--border);border-radius:var(--r-sm);padding:9px 12px;font-size:14px;color:var(--text);font-family:monospace;text-transform:uppercase"
          oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9]/g,'')">
      </div>
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">Type</div>
        <select style="width:100%;background:var(--surface3);border:1px solid var(--border);border-radius:var(--r-sm);padding:9px 8px;font-size:13px;color:var(--text)">
          <option value="percent">% Off</option>
          <option value="fixed">$ Off</option>
        </select>
      </div>
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">Amount</div>
        <input type="number" placeholder="20" min="1" max="100"
          style="width:100%;background:var(--surface3);border:1px solid var(--border);border-radius:var(--r-sm);padding:9px 12px;font-size:14px;color:var(--text)">
      </div>
      <button type="button" onclick="removeCouponRow(${id})"
        style="width:32px;height:32px;border-radius:var(--r-sm);background:transparent;border:1px solid var(--border);color:var(--muted);display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;margin-bottom:2px">×</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 150px;gap:8px;margin-top:8px">
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">Max Uses <span style="font-weight:400;text-transform:none">(optional)</span></div>
        <input type="number" placeholder="Unlimited" min="1"
          style="width:100%;background:var(--surface3);border:1px solid var(--border);border-radius:var(--r-sm);padding:9px 12px;font-size:14px;color:var(--text)">
      </div>
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">Expires <span style="font-weight:400;text-transform:none">(optional)</span></div>
        <input type="date"
          style="width:100%;background:var(--surface3);border:1px solid var(--border);border-radius:var(--r-sm);padding:8px 10px;font-size:13px;color:var(--text)">
      </div>
    </div>`;
  builder.appendChild(row);
}
function removeCouponRow(id) {
  document.getElementById(`coupon-row-${id}`)?.remove();
  couponRows = couponRows.filter(r => r !== id);
}
function getCouponRowData() {
  return couponRows.map(id => {
    const row      = document.getElementById(`coupon-row-${id}`);
    if (!row) return null;
    const inputs   = row.querySelectorAll('input');
    const selects  = row.querySelectorAll('select');
    const code     = inputs[0]?.value.trim().toUpperCase();
    const type     = selects[0]?.value;
    const amount   = parseFloat(inputs[1]?.value);
    const maxUses  = inputs[2]?.value ? parseInt(inputs[2].value) : null;
    const expires  = inputs[3]?.value || null;
    if (!code || !amount) return null;
    return { code, discount_type: type, discount_value: amount, max_uses: maxUses, expires_at: expires };
  }).filter(Boolean);
}

let _appliedCoupon = null;
async function applyCoupon() {
  const code   = document.getElementById('couponInput')?.value.trim();
  const msgEl  = document.getElementById('couponMsg');
  const btn    = document.querySelector('#ticketSheet .btn-outline');
  if (!code || !selectedEvent) return;
  btn.disabled = true; btn.textContent = '…';
  msgEl.style.display = 'none';
  try {
    const tt  = selectedEvent.ticket_types?.[selectedTicketTypeIdx] ?? selectedEvent.ticket_types?.[0];
    const res = await fetch(`${API_BASE}/api/events/${selectedEvent.id}/validate-coupon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, ticketPriceCents: tt?.price_cents || 0, qty: currentQty }),
    });
    const data = await res.json();
    if (!res.ok) {
      msgEl.style.cssText = 'font-size:12px;margin-top:6px;display:block;color:var(--red)';
      msgEl.textContent   = data.error || 'Invalid code';
      _appliedCoupon      = null;
      btn.disabled = false; btn.textContent = 'Apply';
      return;
    }
    _appliedCoupon = data;
    msgEl.style.cssText = 'font-size:12px;margin-top:6px;display:block;color:var(--green)';
    msgEl.textContent   = `${data.label} applied!`;
    const newTotal = data.newTotal;
    const pf       = Math.round(newTotal * 0.07);
    document.getElementById('bdFace').textContent  = `$${(newTotal/100).toFixed(2)}`;
    document.getElementById('bdPf').textContent    = `$${(pf/100).toFixed(2)}`;
    document.getElementById('bdTotal').textContent = `$${((newTotal + pf)/100).toFixed(2)}`;
    document.getElementById('payBtnAmt').textContent = `$${((newTotal + pf)/100).toFixed(2)}`;
    btn.disabled = false; btn.textContent = 'Applied';
    btn.style.color = 'var(--green)';
  } catch(e) {
    msgEl.style.cssText = 'font-size:12px;margin-top:6px;display:block;color:var(--red)';
    msgEl.textContent   = 'Could not apply code.';
    btn.disabled = false; btn.textContent = 'Apply';
  }
}

async function shareEventById(eventId) {
  const url   = `${location.origin}/#event/${eventId}`;
  const title = 'Check out this event on ChristLink';
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return;
    } catch(e) {
      if (e.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    showToast('Link copied!', 'success');
  } catch {
    showToast(url, 'info');
  }
}

// ── SCANNER STATS & RECENT SCANS ─────────────────────────────
function updateScannerStats(scanned, total) {
  const pct = total > 0 ? Math.round((scanned / total) * 100) : 0;
  const s = document.getElementById('statScanned');
  const t = document.getElementById('statTotal');
  const p = document.getElementById('statPct');
  if (s) s.textContent = scanned;
  if (t) t.textContent = total;
  if (p) p.textContent = `${pct}%`;
}

function addRecentScan(name, code, status) {
  const list = document.getElementById('recentScansList');
  if (!list) return;
  const empty = list.querySelector('[data-empty]');
  if (empty) empty.remove();
  const color = status === 'success' ? 'var(--green)' : status === 'warning' ? 'var(--gold)' : 'var(--red)';
  const icon  = status === 'success' ? '<svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : status === 'warning' ? '<svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M7 2L13 12H1L7 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="7" y1="6" x2="7" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' : '<svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const time  = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const row   = document.createElement('div');
  row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border)';
  row.innerHTML = `
    <div style="width:24px;height:24px;border-radius:50%;background:${color}22;display:flex;align-items:center;justify-content:center;font-size:12px;color:${color};flex-shrink:0">${icon}</div>
    <div style="flex:1;min-width:0">
      <div style="font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(name || code)}</div>
      <div style="font-size:10px;color:var(--muted);font-family:monospace">${code}</div>
    </div>
    <div style="font-size:10px;color:var(--muted2);flex-shrink:0">${time}</div>`;
  list.prepend(row);
  const rows = list.querySelectorAll('div[style]');
  if (rows.length > 10) rows[rows.length - 1].remove();
}

async function manualScanLookup() {
  const code = document.getElementById('manualCodeInput')?.value.trim().toUpperCase();
  if (!code) return;
  await handleScannedCode(JSON.stringify({ code, eventId: scannerEventId }));
  document.getElementById('manualCodeInput').value = '';
}

// ── DUPLICATE EVENT ──────────────────────────────────────────
async function duplicateEvent(eventId, btn) {
  btn.disabled = true; btn.textContent = '…';
  try {
    const res  = await fetch(`${API_BASE}/api/events/${eventId}/duplicate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Duplicate failed');
    showToast('Event duplicated as draft', 'success');
    btn.disabled = false; btn.textContent = 'Duplicate';
    // Refresh My Events list
    if (typeof loadHostedEvents === 'function') loadHostedEvents(true);
  } catch(e) {
    showToast(e.message, 'error');
    btn.disabled = false; btn.textContent = 'Duplicate';
  }
}

// ── TOGGLE EVENT VISIBILITY ───────────────────────────────────
async function toggleEventVisibility(eventId, currentStatus, btn) {
  const willPublish = currentStatus !== 'published';
  if (!willPublish && !confirm('Unpublish this event? It will no longer appear in search.')) return;
  btn.disabled = true; btn.textContent = '…';
  try {
    const res  = await fetch(`${API_BASE}/api/events/${eventId}/toggle-visibility`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    const nowPublished = data.status === 'published';
    showToast(nowPublished ? 'Event published' : 'Event unpublished', 'success');
    // Instantly update button text + colour without waiting for full list reload
    btn.textContent = nowPublished ? 'Unpublish' : 'Publish';
    btn.style.color      = nowPublished ? 'var(--gold)' : '#4EC98C';
    btn.style.background = nowPublished ? 'rgba(201,168,76,.1)' : 'rgba(78,201,140,.1)';
    btn.style.borderColor= nowPublished ? 'rgba(201,168,76,.3)' : 'rgba(78,201,140,.3)';
    btn.disabled = false;
    fetchMyEvents();
  } catch(e) {
    showToast(e.message, 'error');
    btn.disabled = false; btn.textContent = willPublish ? 'Publish' : 'Unpublish';
  }
}

// ── EDIT EVENT COUPON MANAGEMENT ─────────────────────────────
let _eeeCouponRows = []; // new coupon rows being added
let _eeeCouponEventId = null;

async function loadEeeCoupons(eventId) {
  _eeeCouponEventId = eventId;
  _eeeCouponRows    = [];
  const list    = document.getElementById('eeeCouponList');
  const builder = document.getElementById('eeeCouponBuilder');
  if (!list || !builder) return;
  list.innerHTML    = '<div style="font-size:12px;color:var(--muted);padding:4px 0">Loading…</div>';
  builder.innerHTML = '';
  try {
    const res  = await fetch(`${API_BASE}/api/events/${eventId}/coupons`, {
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    const data = await res.json();
    const coupons = data.coupons || [];
    if (!coupons.length) {
      list.innerHTML = '<div style="font-size:12px;color:var(--muted);padding:4px 0">No discount codes yet.</div>';
    } else {
      list.innerHTML = coupons.map(c => `
        <div style="display:flex;align-items:center;justify-content:space-between;background:var(--surface3);border:1px solid var(--border);border-radius:var(--r-sm);padding:10px 12px;margin-bottom:8px">
          <div>
            <div style="font-size:13px;font-weight:700;font-family:monospace;color:var(--gold)">${c.code}</div>
            <div style="font-size:11px;color:var(--muted2);">${c.discount_type === 'percent' ? c.discount_value + '% off' : '$' + c.discount_value + ' off'} · ${c.uses}/${c.max_uses || '∞'} uses${c.active ? '' : ' · <span style="color:var(--red)">Inactive</span>'}</div>
          </div>
          ${c.active ? `<button onclick="deactivateEeeCoupon('${c.id}',this)" style="font-size:11px;color:var(--red);background:rgba(224,80,80,.08);border:1px solid rgba(224,80,80,.2);padding:4px 10px;border-radius:var(--r-full);cursor:pointer;font-weight:600">Remove</button>` : ''}
        </div>`).join('');
    }
  } catch(e) {
    list.innerHTML = `<div style="font-size:12px;color:var(--red);padding:4px 0">${escapeHtml(e.message)}</div>`;
  }
}

async function deactivateEeeCoupon(couponId, btn) {
  btn.disabled = true; btn.textContent = '…';
  try {
    await fetch(`${API_BASE}/api/events/${_eeeCouponEventId}/coupons/${couponId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentSession?.access_token}` },
    });
    loadEeeCoupons(_eeeCouponEventId);
  } catch(e) { btn.disabled = false; btn.textContent = 'Remove'; }
}

function addEeeCouponRow() {
  const id      = Date.now();
  _eeeCouponRows.push(id);
  const builder = document.getElementById('eeeCouponBuilder');
  if (!builder) return;
  const row = document.createElement('div');
  row.id = `eee-coupon-row-${id}`;
  row.style.cssText = 'background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-md);padding:12px;margin-bottom:8px';
  row.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 80px 70px 28px;gap:6px;align-items:end">
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Code</div>
        <input type="text" placeholder="SAVE20" maxlength="20" autocapitalize="characters"
          style="width:100%;background:var(--surface3);border:1px solid var(--border);border-radius:var(--r-sm);padding:8px 10px;font-size:13px;color:var(--text);font-family:monospace;text-transform:uppercase"
          oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9]/g,'')">
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Type</div>
        <select style="width:100%;background:var(--surface3);border:1px solid var(--border);border-radius:var(--r-sm);padding:8px 6px;font-size:12px;color:var(--text)">
          <option value="percent">% Off</option>
          <option value="fixed">$ Off</option>
        </select>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Amount</div>
        <input type="number" placeholder="20" min="1" max="100"
          style="width:100%;background:var(--surface3);border:1px solid var(--border);border-radius:var(--r-sm);padding:8px 10px;font-size:13px;color:var(--text)">
      </div>
      <button type="button" onclick="removeEeeCouponRow(${id})"
        style="width:28px;height:28px;border-radius:var(--r-sm);background:transparent;border:1px solid var(--border);color:var(--muted);display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer">×</button>
    </div>`;
  builder.appendChild(row);
}

function removeEeeCouponRow(id) {
  document.getElementById(`eee-coupon-row-${id}`)?.remove();
  _eeeCouponRows = _eeeCouponRows.filter(r => r !== id);
}

async function saveEeeCoupons() {
  if (!_eeeCouponEventId || !_eeeCouponRows.length) return;
  for (const id of _eeeCouponRows) {
    const row     = document.getElementById(`eee-coupon-row-${id}`);
    if (!row) continue;
    const inputs  = row.querySelectorAll('input');
    const selects = row.querySelectorAll('select');
    const code    = inputs[0]?.value.trim().toUpperCase();
    const type    = selects[0]?.value;
    const amount  = parseFloat(inputs[1]?.value);
    if (!code || !amount) continue;
    await fetch(`${API_BASE}/api/events/${_eeeCouponEventId}/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession?.access_token}` },
      body: JSON.stringify({ code, discount_type: type, discount_value: amount }),
    });
  }
}

// ── SWIPE TO GO BACK ─────────────────────────────────────────
(function() {
  let _sx = 0, _sy = 0, _t = 0;
  const EDGE = 30;   // px from left edge to start swipe
  const MIN_X = 60;  // minimum horizontal distance
  const MAX_Y = 80;  // maximum vertical drift

  document.addEventListener('touchstart', e => {
    const t = e.touches[0];
    _sx = t.clientX; _sy = t.clientY; _t = Date.now();
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const t = e.changedTouches[0];
    const dx = t.clientX - _sx;
    const dy = Math.abs(t.clientY - _sy);
    const dt = Date.now() - _t;
    if (_sx > EDGE || dx < MIN_X || dy > MAX_Y || dt > 500) return;
    // Determine active page and navigate back
    const active = document.querySelector('.page.active');
    if (!active) return;
    const id = active.id;
    if (id === 'page-event-detail') { goTo(prevPage || 'browse'); }
    else if (id === 'page-forum')   { closeForum(); }
    else if (id === 'page-host')    { goTo('home'); }
    else if (id === 'page-admin')   { goTo('profile'); }
  }, { passive: true });
})();
