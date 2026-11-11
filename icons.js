const paths = {
  cube:'<path d="m12 2.7 8.7 5v9.2l-8.7 5-8.7-5V7.7zM3.7 7.8l8.3 4.8 8.3-4.8M12 12.6v8.8"/><path d="m7.8 5.5 8.5 4.8"/>',
  arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
  ne:'<path d="M6 18 18 6M7 6h11v11"/>',
  left:'<path d="m14.5 5-7 7 7 7"/>',right:'<path d="m9.5 5 7 7-7 7"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  back:'<path d="M20 12H4m7-7-7 7 7 7"/>',
  expand:'<path d="M8.5 4H4v4.5M15.5 4H20v4.5M20 15.5V20h-4.5M8.5 20H4v-4.5"/>',
  collapse:'<path d="M4 8h4V4m8 0v4h4m0 8h-4v4M8 20v-4H4"/>',
  pin:'<path d="M19 9.5c0 5.1-7 11.3-7 11.3S5 14.6 5 9.5a7 7 0 1 1 14 0Z"/><circle cx="12" cy="9.5" r="2.1"/>',
  gauge:'<path d="M3.6 17.5a9 9 0 1 1 16.8 0H3.6Zm8.4-4.7 4.5-4.1"/><circle cx="12" cy="13" r=".8"/>',
  bolt:'<path d="m13.3 2.5-9 11h6l.1 8 9.3-12h-6.5z"/>',
  motor:'<path d="M5.5 6.5h13v11h-13zM2.5 9v6M21.5 9v6M9 3.5v3m6-3v3M9 17.5v3m6-3v3"/>',
  grid:'<rect x="3.5" y="3.5" width="6" height="6" rx="1"/><rect x="14.5" y="3.5" width="6" height="6" rx="1"/><rect x="3.5" y="14.5" width="6" height="6" rx="1"/><rect x="14.5" y="14.5" width="6" height="6" rx="1"/>',
  compare:'<path d="M3.5 5.5h6.8v13H3.5zm10.2 0h6.8v13h-6.8z"/>',
  image:'<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="m4 16 5-5 4 4 3-3 4 4"/><circle cx="15.7" cy="9" r="1.2"/>',
  close:'<path d="m5 5 14 14M19 5 5 19"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 10.8v5m0-8.4v.2"/>',
  spin:'<path d="M5 8.2a9.7 5.4 0 1 1-2.5 4.1M5 4.5v4.8H.9"/>',
  reset:'<path d="M4.1 10a8 8 0 1 1 .3 5M4 4.5V10h5.5"/>',
  minus:'<path d="M5 12h14"/>',plus:'<path d="M4 12h16m-8-8v16"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1.5v3M12 19.5v3m10.5-10.5h-3m-15 0h-3M4.6 4.6l2.1 2.1m10.6 10.6 2.1 2.1m0-14.8-2.1 2.1M6.7 17.3l-2.1 2.1"/>',
  dusk:'<path d="M2 17h20M8 20.5h8M6.5 16a5.5 5.5 0 1 1 11 0M12 3v4M2.8 8l2.4 2.1M21.2 8l-2.4 2.1"/>',
  moon:'<path d="M20.7 14.7a9 9 0 0 1-11.4-11A8.8 8.8 0 1 0 20.7 14.7Z"/>',
  check:'<path d="m4.5 12 4.9 4.8L19.5 7"/>',
  hand:'<path d="M8 13V6.2a1.5 1.5 0 0 1 3 0v5.2-7a1.5 1.5 0 0 1 3 0v6.8-5a1.5 1.5 0 0 1 3 0v5.2-2a1.5 1.5 0 0 1 3 0v5.3c0 3.6-2.5 6.3-6 6.3h-1.4c-2.2 0-3.8-.8-5.3-2.7l-4.1-5.2c-1.1-1.6.7-3.2 2.2-2.1L8 13Z"/>',
  swap:'<path d="M3 8h15l-4-4m7 12H6l4 4"/>',book:'<path d="M4 4.5h7c1 0 1.5.7 1.5 1.6v14c0-1-.5-1.5-1.5-1.5H4zm16 0h-6c-1 0-1.5.7-1.5 1.6v14c0-1 .5-1.5 1.5-1.5h6z"/>'
};
export function icon(name, size=18) {
  return '<svg aria-hidden="true" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">'+paths[name]+'</svg>';
}
