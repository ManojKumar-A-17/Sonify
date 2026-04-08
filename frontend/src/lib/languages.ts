export const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
];

export const sourceLanguages = [
  { code: 'auto', name: 'Auto Detect' },
  ...languages,
];

export const sttLanguages = [
  { code: 'auto', name: 'Best Effort Auto Detect' },
  ...languages,
];
