// 按需全局引入 vant组件
import Vue from 'vue'
import { Button, List, Cell, Tabbar, TabbarItem, Overlay } from 'vant'
Vue.use(Button)
Vue.use(Cell)
Vue.use(List)
Vue.use(Tabbar).use(TabbarItem)
import { Cascader } from 'vant'
import { DropdownMenu, DropdownItem } from 'vant'

Vue.use(DropdownMenu)
Vue.use(Overlay)
Vue.use(DropdownItem)
Vue.use(Cascader)
import { DatetimePicker } from 'vant'
import { Form } from 'vant'
import { Field } from 'vant'
import { Popup } from 'vant'
import { NumberKeyboard } from 'vant'
import { ActionSheet } from 'vant'
import { Search } from 'vant'

Vue.use(Search)
Vue.use(ActionSheet)
Vue.use(NumberKeyboard)
Vue.use(DatetimePicker)
Vue.use(Popup)
Vue.use(Form)
Vue.use(Field)

import { NavBar } from 'vant'
Vue.use(NavBar)

import { Col, Row } from 'vant'

Vue.use(Col)
Vue.use(Row)

import { Lazyload } from 'vant'

Vue.use(Lazyload)

// 注册时可以配置额外的选项
Vue.use(Lazyload, {
  lazyComponent: true
})

import { Loading } from 'vant'

Vue.use(Loading)

import { Icon } from 'vant'

Vue.use(Icon)
import { PullRefresh } from 'vant'

Vue.use(PullRefresh)
import { Checkbox, CheckboxGroup } from 'vant'

Vue.use(Checkbox)
Vue.use(CheckboxGroup)

import { Dialog } from 'vant'

// 全局注册
Vue.use(Dialog)

import { Toast } from 'vant'

Vue.use(Toast)

