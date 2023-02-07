<script lang="ts" setup>
import { ref, onMounted, reactive, computed, h } from 'vue'
import type { Component } from 'vue'
import { NIcon } from 'naive-ui'
import type { InputInst } from 'naive-ui'
import { appConfig } from '@/stores/appConfig'
import { storeToRefs } from 'pinia'
import {
  SettingsOutline as SettingsIcon,
  SunnyOutline as SunnyIcon,
  MoonOutline as MoonIcon,
  TimeOutline as TimeIcon,
  PeopleOutline as PeopleIcon,
  NotificationsOutline as NotificationIcon,
  SearchOutline as SearchIcon,
  StarOutline as StarIcon,
  CheckboxOutline as CheckmarkIcon,
  CalendarOutline as CalendarIcon,
  AddOutline as AddIcon,
  PencilOutline as PencilIcon,
  ListOutline as ListIcon,
} from '@vicons/ionicons5'
import { random } from '@/tools/math'
import sha1 from 'sha1'
// 渲染图标
const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const config = appConfig()

// sider的相关逻辑
const sider = reactive({
  value: storeToRefs(config).sider,
  update: (value: boolean) => {
    sider.value = !value
  }
})

// sider内部组件的相关逻辑
const siderSearch = reactive({
  value: '',
})
const siderSelected = reactive<{ label: string, key: string }>(
  {
    label: '我的一天',
    key: 'day',
  }
)
const siderMenu = reactive({
  value: 'day',
  menu: [
    {
      label: '我的一天',
      key: 'day',
      icon: renderIcon(SunnyIcon),
    },
    {
      label: '重要事项',
      key: 'important',
      icon: renderIcon(StarIcon),
    },
    {
      label: '计划内',
      key: 'plan',
      icon: renderIcon(CalendarIcon),
    },
    {
      label: '任务',
      key: 'task',
      icon: renderIcon(CheckmarkIcon),
    },
    {
      type: 'divider',
      key: 'divider-1',
    }
  ],
  update: (key: string) => {
    siderMenu.value = key
    const select = siderMenu.menu.find(item => item.key === key) as { label: string, key: string }
    siderSelected.label = select.label
    siderSelected.key = select.key
  },
  add: () => {
    const menu = {
      label: '新建列表',
      key: sha1(Date.now() + '-' + random(1000, 9999).toString()),
      icon: renderIcon(ListIcon),
    }
    siderMenu.menu.push(menu)
    siderMenu.update(menu.key)
    titleEdit()
  }
})

// popover的相关逻辑
const popover = reactive({
  hello: computed(() => {
    // 根据时间来判断
    const hour = new Date().getHours()
    if (hour > 6 && hour < 12) {
      return '早上好'
    } else if (hour >= 12 && hour < 18) {
      return '下午好'
    } else if (hour >= 18 && hour < 24) {
      return '晚上好'
    } else {
      return '夜深了'
    }
  }),
  name: 'ddi爱吃M记',
})

// menu的相关逻辑
const popoverMenu = reactive({
  menu: [
    {
      label: '个人中心',
      key: 'profile',
      icon: renderIcon(PeopleIcon),
    },
    {
      label: '系统设置',
      key: 'settings',
      icon: renderIcon(SettingsIcon),
    }
  ],
  update: (key: string) => {
    return
  }
})

const changeTheme = (value: string) => {
  window.postMessage(value)
}


// 获取当前主题
const currentTheme = computed(() => {
  if (config.theme === 'auto') {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    } else {
      return 'light'
    }
  } else {
    return config.theme
  }
})

// title点击进入input
const titleInput = ref(false)
const titleInputRef = ref<InputInst | null>(null)
const titleInputValue = ref('')
const titleEdited = () => {
  titleInput.value = false
  const menu = siderMenu.menu.find(item => item.key === siderSelected.key)
  if (menu) {
    menu.label = titleInputValue.value
    siderSelected.label = titleInputValue.value
  }
}
const titleEdit = () => {
  const diabled = ['day', 'important', 'plan', 'task']
  if (diabled.includes(siderSelected.key)) {
    return
  }
  titleInput.value = true
  titleInputValue.value = siderSelected.label
  setTimeout(() => {
    titleInputRef.value?.focus()
  }, 0)
}

</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24px;
}

.float-right {
  float: right;
}

.header-bar-right {
  display: flex;
  align-items: center;
  gap: 32px;
}

.sider-bottom-center {
  position: absolute;
  bottom: 0;
  height: 32px;
  width: 90%;
  padding-left: 10%;
  margin-bottom: 16px;
}

.plan-bar {
  height: 64px;
  box-shadow: 0 2px 8px rgba(88, 88, 88, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}
</style>

<template>
  <n-layout style="height: 100vh">
    <n-layout-header style="height: 64px;" bordered>
      <div class="header-bar">
        <h2>NoToDo</h2>
        <div class="header-bar-right">
          <n-badge :value="2" :max="15">
            <n-button text style="font-size: 22px;">
              <n-icon>
                <NotificationIcon />
              </n-icon>
            </n-button></n-badge>
          <n-popover trigger="hover" style="width: 250px">
            <template #trigger>
              <n-avatar :style="{
                color: 'yellow',
                backgroundColor: 'red'
              }">
                M
              </n-avatar>
            </template>
            <n-list>
              <n-list-item>
                <template #prefix>
                  <n-avatar :size="48" :style="{
                    color: 'yellow',
                    backgroundColor: 'red'
                  }">
                    M
                  </n-avatar>
                </template>
                <h3>{{ popover.hello }}，</h3>
                <p>{{ popover.name }}</p>
              </n-list-item>
              <n-list-item>
                <n-menu :options="popoverMenu.menu" :value="null" @update:value="popoverMenu.update" />
              </n-list-item>
              <n-list-item>
                <n-button-group class="float-right">
                  <n-button icon-placement="left" size="tiny" @click="changeTheme('auto')">
                    <n-icon>
                      <TimeIcon />
                    </n-icon>
                    <span>自动</span>
                  </n-button>
                  <n-button icon-placement="left" size="tiny"
                    @click="changeTheme(currentTheme === 'light' ? 'dark' : 'light')">
                    <n-icon>
                      <MoonIcon v-if="currentTheme === 'light'" />
                      <SunnyIcon v-else />
                    </n-icon>
                    <span>{{ currentTheme === 'light' ? '深色' : '浅色' }}</span>
                  </n-button>
                </n-button-group>
              </n-list-item>
            </n-list>
          </n-popover>
        </div>
      </div>
    </n-layout-header>
    <n-layout position="absolute" style="top: 64px;" has-sider>
      <n-layout-sider bordered show-trigger collapse-mode="width" :collapsed-width="64" :width="240"
        :native-scrollbar="false" :collapsed="!sider.value" @update:collapsed="sider.update">
        <n-input v-model:value="siderSearch.value" placeholder="搜索" bordered
          :style="{ width: '90%', margin: '16px 5%' }" path="search" v-if="sider.value">
          <template #prefix>
            <n-icon :component="SearchIcon" />
          </template>
        </n-input>
        <n-menu :collapsed-width="64" :collapsed-icon-size="22" :options="siderMenu.menu" :value="siderMenu.value"
          @update:value="siderMenu.update" style="margin-bottom: 64px;" />
        <div class="sider-bottom-center">
          <n-button quaternary block @click="siderMenu.add">
            <template #icon>
              <n-icon :size="sider.value ? 20 : 22">
                <AddIcon />
              </n-icon>
            </template>
            <span v-if="sider.value">新建列表</span>
          </n-button>
        </div>
      </n-layout-sider>
      <n-layout content-style="padding: 24px;" :native-scrollbar="false">
        <div class="plan-bar">
          <h2 v-if="!titleInput" @click="titleEdit">{{ siderSelected.label }}</h2>
          <n-input v-else ref="titleInputRef" :placeholder="siderSelected.label" v-model:value="titleInputValue"
            @change="titleEdited" @blur="titleEdited">
            <template #prefix>
              <n-icon :component="PencilIcon" />
            </template>
          </n-input>
        </div>
        <n-layout-footer bordered position="absolute"
          style="height: 64px; display: flex; align-items: center; padding: 6px 36px;">
          <n-input placeholder="添加任务">
            <template #prefix>
              <n-icon :component="AddIcon" />
            </template>
          </n-input>
        </n-layout-footer>
      </n-layout>
    </n-layout>
  </n-layout>
</template>