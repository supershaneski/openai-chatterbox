import { ref } from 'vue'

export const useLocale = () => useState('locale', () => useDefaultLocale().value)

export const useDefaultLocale = (fallback = 'en-US') => {
  const locale = ref(fallback)
  if (process.server) {
    // Learn more about the nuxtApp interface on https://nuxt.com/docs/guide/going-further/internals#the-nuxtapp-interface
    const reqLocale = useRequestHeaders()['accept-language']?.split(',')[0]
    if (reqLocale) {
      locale.value = reqLocale
    }
  } else if (process.client) {
    const navLang = navigator.language
    if (navLang) {
      locale.value = navLang
    }
  }
  return locale
}