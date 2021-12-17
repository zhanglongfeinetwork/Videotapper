import { Locale } from 'vant'
import enUS from 'vant/lib/locale/lang/en-US'
import zhCN from 'vant/lib/locale/lang/zh-CN'

export function Locals(lang) {
  switch (lang) {
    case 'zh':
      Locale.use('zh', zhCN)
      break
    default:
      Locale.use('en', enUS)
      break
  }
}
