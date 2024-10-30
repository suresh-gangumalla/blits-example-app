/*
 * Copyright 2023 Comcast Cable Communications Management, LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import Blits from '@lightningjs/blits'

import { Account, Device, Localization } from '@firebolt-js/sdk'
import fireBoltModules from '../api/fireBolt'

const Module = Blits.Component('Module', {
  template: `
    <Element w="$w" h="$h" :color="{left:$bgLeft , right:$bgRight}">
      <Text x="$w/2" y="$h/2" mount="{x:0.5, y:0.5}" :content="$name" :color.transition="$fColor" font="raleway" />
    </Element>
    `,
  state() {
    return {
      w: 300,
      h: 250,
      bgLeft: '#b43fcb',
      bgRight: '#6150cb',
      fColor: '#fff',
    }
  },
  props: ['name'],
  hooks: {
    focus() {
      this.bgLeft = '#efc18f99'
      this.bgRight = '#ffddcc'
      this.fColor = '#000'
    },
    unfocus() {
      this.bgLeft = '#b43fcb'
      this.bgRight = '#6150cb'
      this.fColor = '#fff'
    },
  },
  input: {
    enter() {
      this.$router.to(`/examples/firebolt/${this.name}`)
    },
  },
})

const Method = Blits.Component('Methods', {
  template: `
    <Element>
      <Element w="$w" h="$h" :color="{left: $method.bgLeft, right: $method.bgRight}">
        <Text :content="$name" x="$w/2" y="$h/2" mount="0.5" :color.transition="$method.color" font="lato" size="50" />
      </Element>
      <Element w="$w" h="50" color="$aboutBgColor" y="75">
        <Text :content="$about" wordwrap="$w" align="center" font="lato" maxlines="1" size="28" y="6" color="#eee" />
      </Element>
    </Element>
    `,
  state() {
    return {
      w: 750,
      h: 75,
      method: {
        color: '#fff',
        bgLeft: '#b43fcb',
        bgRight: '#6150cb',
      },
      aboutBgColor: '#00000060',
    }
  },
  props: ['name', 'about'],
  hooks: {
    focus() {
      this.method.bgLeft = '#efc18f99'
      this.method.bgRight = '#ffddcc'
      this.method.color = '#000'
    },
    unfocus() {
      this.method.bgLeft = '#b43fcb'
      this.method.bgRight = '#6150cb'
      this.method.color = '#fff'
    },
  },
  input: {
    enter() {
      this.$emit('execute', this.name)
    },
  },
})

const List = Blits.Component('List', {
  components: {
    Method,
    Module,
  },
  template: `
    <Element>
      <Element w="1920" h="700" clipping="true" y="200">
        <Element :y.transition="$y">
          <Method
            :for="(item, index) in $methods"
            key="$item.name"
            name="$item.name"
            about="$item.about"
            :y="$index * 160"
            :ref="$type+$index"
          />
        </Element>
      </Element>
      <Element :x.transition="$x" y="540" h="250" mount="{y:0.5}">
        <Module :for="(item, index) in $modules" key="$item.id" name="$item.name" :ref="$type+$index" x="$index * 400" />
      </Element>
    </Element>
    `,
  state() {
    return {
      x: 0,
      y: 0,
      activeIndex: 0,
    }
  },
  props: ['data', 'type'],
  computed: {
    methods() {
      return !this.isModule ? this.data : []
    },
    modules() {
      return this.isModule ? this.data : []
    },
    isModule() {
      return this.type === 'module'
    },
  },
  watch: {
    activeIndex(v) {
      const el = this.$select(`${this.type}${v}`)
      el && el.$focus && el.$focus()
    },
  },
  hooks: {
    focus() {
      this.$trigger('activeIndex')
    },
  },
  input: {
    right() {
      if (this.isModule && this.activeIndex < this.data.length - 1) this.move(1)
    },
    left() {
      if (this.isModule && this.activeIndex > 0) this.move(-1)
    },
    down() {
      if (!this.isModule && this.activeIndex < this.data.length - 1) this.move(1)
    },
    up() {
      if (!this.isModule && this.activeIndex > 0) this.move(-1)
    },
  },
  methods: {
    move(dir) {
      const next = this.activeIndex + dir
      if (this.type == 'method') {
        this.y = next > 3 ? -(next - 3) * 160 : 0
      } else if (this.type == 'module') {
        this.x = next > 3 ? -(next - 3) * 400 : 0
      }
      this.activeIndex = next
    },
  },
})

const FireBolt = Blits.Component('FireBolt', {
  components: {
    List,
  },
  template: `
    <Element>
      <Text content="FireBolt Modules" x="960" y="80" mount="{x:0.5}" size="80" font="raleway" />
      <List data="$moduleNames" type="module" ref="modules" x="400" />
    </Element>
    `,
  computed: {
    moduleNames() {
      return Object.keys(fireBoltModules).map((m) => {
        return { id: m, name: m.charAt(0).toUpperCase() + m.slice(1) }
      })
    },
  },
  hooks: {
    focus() {
      const cmp = this.$select('modules')
      cmp && cmp.$focus && cmp.$focus()
    },
  },
})

const ModuleTemplate = Blits.Component('ModuleTemplate', {
  components: { List },
  template: `
    <Element>
      <Text content="$module.name" x="960" mount="{x:0.5}" y="50" font="raleway" size="40" />
      <Text content="$module.about" x="960" mount="{x:0.5}" y="110" font="lato" />
      <List data="$module.methods" x="200" ref="methods" type="method" :y="$position" />
      <Text x="1400" y="540" :content="$response" :size="$size" mount="0.5" font="lato" :show="$response !== ''" />
    </Element>
    `,
  props: [
    'module',
    'response',
    {
      key: 'size',
      default: 100,
    },
    {
      key: 'position',
      default: 0,
    },
  ],
  hooks: {
    focus() {
      const comp = this.$select('methods')
      comp && comp.$focus && comp.$focus()
    },
  },
})

const DeviceModule = Blits.Component('DeviceModule', {
  components: {
    ModuleTemplate,
  },
  template: `
    <Element>
      <ModuleTemplate module="$module" :response="$response" ref="moduleTemplate" />
      <Element :show="$isNetworkRes">
        <Text :content="'State: ' + $networkRes.state" size="70" font="lato" x="1400" y="500" mount="0.5" />
        <Text :content="'Type: ' + $networkRes.type" size="70" font="lato" y="100" x="1400" y="580" mount="0.5" />
      </Element>
    </Element>
    `,
  state() {
    return {
      module: { ...fireBoltModules.device, name: 'Device' },
      response: '',
      isNetworkRes: false,
      networkRes: {},
    }
  },
  hooks: {
    ready() {
      this.$listen('execute', async (api) => {
        this.isNetworkRes = false
        switch (api) {
          case 'make':
            this.response = await Device.make()
            break
          case 'model':
            this.response = await Device.model()
            break
          case 'name':
            this.response = await Device.name()
            break
          case 'network':
            Object.assign(this.networkRes, await Device.network())
            this.response = ''
            this.isNetworkRes = true
            break
          case 'platform':
            this.response = await Device.platform()
            break
        }
      })
    },
    focus() {
      const comp = this.$select('moduleTemplate')
      comp && comp.$focus && comp.$focus()
    },
  },
})

const AccountModule = Blits.Component('AccountModule', {
  components: {
    ModuleTemplate,
  },
  template: `
    <Element>
      <ModuleTemplate module="$module" :response="$response" :size="$size" ref="moduleTemplate" position="200" />
    </Element>
    `,
  state() {
    return {
      module: { ...fireBoltModules.account, name: 'Account' },
      response: '',
      size: 100,
    }
  },
  hooks: {
    ready() {
      this.$listen('execute', async (api) => {
        this.$log.info(`Execute Account ${api} API`)
        switch (api) {
          case 'id':
            this.size = 100
            this.response = await Account.id()
            break
          case 'uid':
            this.size = 40
            this.response = await Device.uid()
            break
        }
      })
    },
    focus() {
      const comp = this.$select('moduleTemplate')
      comp && comp.$focus && comp.$focus()
    },
  },
})

const LocalizationModule = Blits.Component('LocalizationModule', {
  components: {
    ModuleTemplate,
  },
  template: `
    <Element>
      <ModuleTemplate module="$module" :response="$response" ref="moduleTemplate" />
    </Element>
    `,
  state() {
    return {
      module: { ...fireBoltModules.localization, name: 'Localization' },
      response: '',
    }
  },
  hooks: {
    ready() {
      this.$listen('execute', async (api) => {
        this.response = ''
        switch (api) {
          case 'countryCode':
            this.response = await Localization.countryCode()
            break
          case 'language':
            this.response = await Localization.language()
            break
          case 'latlon':
            this.response = (await Localization.latlon()).toString()
            break
          case 'locality':
            this.response = await Localization.locality()
            break
          case 'postalCode':
            this.response = await Localization.postalCode()
            break
        }
      })
    },
    focus() {
      const comp = this.$select('moduleTemplate')
      comp && comp.$focus && comp.$focus()
    },
  },
})

export const FireBoltRoutes = [
  {
    path: '/examples/firebolt',
    component: FireBolt,
  },
  {
    path: '/examples/firebolt/device',
    component: DeviceModule,
  },
  {
    path: '/examples/firebolt/account',
    component: AccountModule,
  },
  {
    path: '/examples/firebolt/localization',
    component: LocalizationModule,
  },
]
