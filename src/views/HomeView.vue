<script lang="ts" setup>
import { ref, onMounted, reactive, computed, h, nextTick } from 'vue'
import type { Component } from 'vue'
import { NIcon } from 'naive-ui'
import type {
  InputInst,
  DropdownOption,
  DropdownDividerOption,
  DropdownRenderOption,
  DropdownGroupOption,
} from 'naive-ui'
import { appConfig } from '@/stores/appConfig'
import { storeToRefs } from 'pinia'
// 测试loadingButton
import loadButton from '@/components/loadButton.vue'
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
  TrashBinOutline as TrashBinIcon,
  CreateOutline as CreateIcon,
  CheckmarkCircleOutline as CheckmarkCircleIcon,
  CloseOutline as CloseIcon,
  NotificationsOutline as NotificationsIcon,
} from '@vicons/ionicons5'
import contextMenu from '@/components/contextMenu.vue'
// 引入工具函数
import { random } from '@/tools/math'
import { safeHtml, dateDescription } from '@/tools/string'
// 哈希散列列表的key
import sha1 from 'sha1'

const worker = {
  notify: null as Worker | null,
}

// 渲染图标
const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const config = appConfig()
const box = reactive(
  {
    width: window.innerWidth,
    height: window.innerHeight,
  }
)
// 挂载后回调
onMounted(() => {
  box.width = window.innerWidth
  box.height = window.innerHeight
  window.addEventListener('resize', () => {
    box.width = window.innerWidth
    box.height = window.innerHeight
  })

  // 创建worker
  // 提醒的worker
  worker.notify = new Worker(new URL('../workers/notify.ts', import.meta.url), { type: "module" })
  // 获取notification不为undefined的列表
  const notifyList = listData.value.filter(item => item.notification !== undefined)
  // 如果接受到notified消息，则将该消息的notification设置为undefined
  worker.notify.onmessage = (e) => {
    if (e.data.type === 'notified') {
      const index = listData.value.findIndex(item => item.id === e.data.data.id)
      if (index !== -1) {
        listData.value[index].notification = undefined
      }
    }
  }
  // 发送初始化消息
  worker.notify.postMessage({
    type: 'init',
    data: notifyList,
  })
})

// sider的相关逻辑
const { collapsed } = storeToRefs(config)

// sider内部组件的相关逻辑
const siderSearchValue = ref('')
const siderSelected = reactive<{ label: string, key: string }>(
  {
    label: '我的一天',
    key: 'day',
  }
)
const siderMenuValue = ref('day')
const siderMenu = reactive({
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
  ] as Array<{ label: string, key: string, icon: any, children?: any }>,
  update: (key: string) => {
    siderMenuValue.value = key
    const select = siderMenu.menu.find(item => item.key === key) as { label: string, key: string }
    siderSelected.label = select.label
    siderSelected.key = select.key
  },
  add: () => {
    const menu = {
      label: '新建列表',
      key: 'list - ' + sha1(Date.now() + '-' + random(1000, 9999).toString()),
      icon: renderIcon(ListIcon),
    }
    siderMenu.menu.push(menu)
    siderMenu.update(menu.key)
    titleEdit()
  },
  rename: () => {
    titleEdit()
  },
  delete: () => {
    const index = siderMenu.menu.findIndex(item => item.key === siderSelected.key)
    if (index > -1) {
      siderMenu.menu.splice(index, 1)
      siderMenu.update('day')
    }
  },
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
  // 如果修改成了空的，就不修改
  if (titleInputValue.value.trim() === '') {
    titleInputValue.value = siderSelected.label
    nextTick(() => {
      titleInputRef.value?.blur()
    })
    return
  }
  titleInput.value = false
  const menu = siderMenu.menu.find(item => item.key === siderSelected.key)
  if (menu) {
    menu.label = titleInputValue.value
    siderSelected.label = titleInputValue.value
  }
}
const titleEdit = () => {
  const disabled = ['day', 'important', 'plan', 'task']
  if (disabled.includes(siderSelected.key)) {
    return
  }
  titleInput.value = true
  titleInputValue.value = siderSelected.label
  nextTick(() => {
    titleInputRef.value?.focus()
  })
}

// 右键菜单的逻辑
const contextRef = reactive(
  {
    location: {
      x: 0,
      y: 0,
    },
    show: false,
    options: [] as Array<DropdownOption | DropdownGroupOption | DropdownDividerOption | DropdownRenderOption>
  }
)
const contextMenuHandler = {
  handleContextMenu: (e: MouseEvent) => {
    e.preventDefault()
    contextRef.show = false
    const disabled = ['day', 'important', 'plan', 'task']
    // 如果选中的key不是diasbled的，就重新设置menuOptions
    if (!disabled.includes(siderSelected.key) && siderSelected.key.startsWith('list - ')) {
      contextRef.options = [
        {
          label: '管点老家伙',
          key: 'manage',
          disabled: true,
        },
        {
          label: '重命名',
          key: 'rename-list',
          icon: renderIcon(CreateIcon),
        },
        {
          label: '删除列表',
          key: 'delete-list',
          icon: renderIcon(TrashBinIcon),
        },
      ]
    } else {
      contextRef.options = [
        {
          label: '添加新东西',
          key: 'add',
          disabled: true,
        },
        {
          label: '新建列表',
          key: 'add-list',
          icon: renderIcon(ListIcon),
        },
      ]
    }
    nextTick().then(() => {
      contextRef.location.x = e.clientX
      contextRef.location.y = e.clientY
      contextRef.show = true
    })
  },
  onClickoutside: () => {
    contextRef.show = false
  },
  onselect: (key: string | number) => {
    contextRef.show = false
    if (key === 'add-list') {
      siderMenu.add()
    }
    if (key === 'rename-list') {
      siderMenu.rename()
    }
    if (key === 'delete-list') {
      siderMenu.delete()
    }
  }
}

// list data 数据 key为每一个list的key  value为list的数据
const lists = reactive<list[]>([
  {
    id: 'task - ' + sha1(Date.now() + '-' + random(1000, 9999).toString() + '-' + random(1000, 9999).toString()),
    key: siderSelected.key,
    value: 'test',
    originImportant: siderSelected.key === 'important',
    originMyDay: siderSelected.key === 'day',
    originPlan: siderSelected.key === 'plan',
    creatTime: Date.now(),
  }
])
const listData = computed(() => {
  if (siderSelected.key === 'day') {
    return lists.filter(item => item.isMyDay || item.originMyDay)
  } else if (siderSelected.key === 'important') {
    return lists.filter(item => item.isImportant || item.originImportant)
  } else if (siderSelected.key === 'plan') {
    return lists.filter(item => item.isPlan || item.originPlan)
  } else if (siderSelected.key === 'task') {
    //这里要返回 day important plan 以内的所有任务
    return lists.filter(item => item.isMyDay || item.isImportant || item.isPlan || item.originMyDay || item.originImportant || item.originPlan)
  } else {
    return lists.filter(item => item.key === siderSelected.key)
  }
})
// 返回listdata中已经完成的任务
const listFinished = computed(() => {
  return listData.value.filter(item => item.isFinished)
})

const newTaskValue = ref('')
// 添加新的任务
const createNewList = () => {
  if (!newTaskValue.value) {
    return
  }
  lists.push({
    id: 'task - ' + sha1(Date.now() + '-' + random(1000, 9999).toString() + '-' + random(1000, 9999).toString()),
    key: siderSelected.key,
    value: newTaskValue.value,
    isImportant: siderSelected.key === 'important',
    isMyDay: siderSelected.key === 'day',
    isPlan: siderSelected.key === 'plan',
    creatTime: Date.now(),
  })
  newTaskValue.value = ''
}

// 任务的右边抽屉的相关逻辑
const contentDrawer = reactive(
  {
    show: false,
    content: {} as list,
  }
)
// 修改任务
const taskEdit = (id: string) => {
  const task = lists.find(item => item.id === id)
  if (task) {
    // 将task中的steps的isFinished没有的属性设置为false
    if (task.steps) {
      task.steps = task.steps.map(item => {
        return {
          key: item.key,
          value: item.value,
          isFinished: item.isFinished || false,
        }
      })
    } else {
      task.steps = []
    }
    contentDrawer.content = task
    contentDrawer.show = true
  }
}
// 默认步骤
const creatStep = () => {
  return {
    key: 'step - ' + sha1(Date.now() + '-' + random(1000, 9999).toString() + '-' + random(1000, 9999).toString()),
    value: '新建步骤',
    isFinished: false,
  }
}
// 添加步骤
const addSteps = (value: step[]) => {
  contentDrawer.content.steps = value.map(item => {
    return {
      key: 'step - ' + sha1(Date.now() + '-' + random(1000, 9999).toString() + '-' + random(1000, 9999).toString()),
      value: item.value,
      isFinished: item.isFinished,
    }
  })
}

// 修改任务标题
const editTaskTitle = ref(false)
const editTaskTitleRef = ref<InputInst>()
const editTaskTitleValue = ref('')
const editTaskTitleShow = () => {
  editTaskTitleValue.value = contentDrawer.content.value
  editTaskTitle.value = true
  nextTick(() => {
    editTaskTitleRef.value?.focus()
  })
}
const editTaskTitleHide = () => {
  // 如果是空的话就不修改
  if (editTaskTitleValue.value.trim() === '') {
    editTaskTitleValue.value = contentDrawer.content.value
    nextTick(() => {
      editTaskTitleRef.value?.blur()
    })
    return
  }
  contentDrawer.content.value = editTaskTitleValue.value
  editTaskTitle.value = false
}

// 根据指定的id删除任务
const deleteTask = (id: string) => {
  const index = lists.findIndex(item => item.id === id)
  if (index !== -1) {
    lists.splice(index, 1)
  }
  contentDrawer.show = false
}

// 提醒我相关逻辑
const notifyMe = reactive({
  options: [
    {
      label: '今天晚些时候(18:00)',
      key: 'today-later',
      disabled: new Date().getHours() >= 18
    },
    {
      label: '明天早些时候(9:00)',
      key: 'tomorrow-earlier',
      disabled: false
    },
    {
      label: '明天晚些时候(18:00)',
      key: 'tomorrow-later',
      disabled: false
    },
    {
      label: '下周早些时候(9:00)',
      key: 'next-week-earlier',
      disabled: false
    },
    {
      label: '下周晚些时候(18:00)',
      key: 'next-week-later',
      disabled: false
    },
    {
      label: '自定义',
      key: 'custom',
    },
    {
      label: '取消提醒',
      key: 'none',
      disabled: contentDrawer.content.notification === undefined
    }
  ],
  handleSelect(key: string | number) {
    const date = new Date()
    date.setMilliseconds(0)
    if (key !== 'none') {
      notifyMe.options[6].disabled = false
    }
    if (key === 'today-later') {
      date.setHours(18)
      date.setMinutes(0)
      date.setSeconds(0)
    } else if (key === 'tomorrow-earlier') {
      date.setDate(date.getDate() + 1)
      date.setHours(9)
      date.setMinutes(0)
      date.setSeconds(0)
    } else if (key === 'tomorrow-later') {
      date.setDate(date.getDate() + 1)
      date.setHours(18)
      date.setMinutes(0)
      date.setSeconds(0)
    } else if (key === 'next-week-earlier') {
      date.setDate(date.getDate() + 7)
      date.setHours(9)
      date.setMinutes(0)
      date.setSeconds(0)
    } else if (key === 'next-week-later') {
      date.setDate(date.getDate() + 7)
      date.setHours(18)
      date.setMinutes(0)
      date.setSeconds(0)
    } else if (key === 'none') {
      contentDrawer.content.notification = undefined
      notifyMe.options[6].disabled = true
    } else {
      notifyMe.custom.show = true
    }
    if (key !== 'none' && key !== 'custom') {
      contentDrawer.content.notification = date.getTime()
      worker.notify!.postMessage({
        type: 'add',
        // 数据不能clone，否则会报错，采用JSON.parse(JSON.stringify())的方式
        data: JSON.parse(JSON.stringify(contentDrawer.content))
      })
    }
  },
  custom: {
    show: false,
    value: new Date().getTime(),
    handleSelect(value: number) {
      contentDrawer.content.notification = value
      notifyMe.custom.show = false
      worker.notify!.postMessage({
        type: 'add',
        // 数据不能clone，否则会报错，采用JSON.parse(JSON.stringify())的方式
        data: JSON.parse(JSON.stringify(contentDrawer.content))
      })
    }
  }
})

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
  margin-bottom: 16px;
}

.text-bottom-center {
  position: absolute;
  width: 100%;
  bottom: 0;
  height: 32px;
  margin-bottom: 16px;
  left: 0;
  text-align: center;
}

.top-bar {
  display: flex;
  justify-content: space-between;
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
      <n-layout-sider bordered show-trigger collapse-mode="width" :collapsed-width="config.isMobile ? 0 : 64" :width="240"
        :native-scrollbar="false" v-model:collapsed="collapsed"
        @contextmenu.prevent="contextMenuHandler.handleContextMenu">
        <n-input v-model:value="siderSearchValue" placeholder="搜索" bordered :style="{ width: '90%', margin: '16px 5%' }"
          path="search" v-if="!collapsed">
          <template #prefix>
            <n-icon :component="SearchIcon" />
          </template>
        </n-input>
        <n-menu :collapsed-width="config.isMobile ? 0 : 64" :collapsed-icon-size="22" :options="siderMenu.menu"
          :value="siderMenuValue" @update:value="siderMenu.update" style="margin-bottom: 64px;" />
        <div class="sider-bottom-center">
          <n-button quaternary block @click="siderMenu.add">
            <template #icon>
              <n-icon :size="!collapsed ? 20 : 22">
                <AddIcon />
              </n-icon>
            </template>
            <span v-if="!collapsed">新建列表</span>
          </n-button>
        </div>
        <contextMenu :options="contextRef.options" :show="contextRef.show"
          :on-clickoutside="contextMenuHandler.onClickoutside" :location="contextRef.location"
          :on-select="contextMenuHandler.onselect" />
      </n-layout-sider>
      <n-layout content-style="padding: 24px;" :native-scrollbar="false">
        <n-drawer v-model:show="contentDrawer.show" :width="!config.isMobile ? 420 : box.width" placement="right">
          <n-drawer-content>
            <div class="top-bar">
              <n-h3 v-if="!editTaskTitle" @click="editTaskTitleShow" style="text-align: center"
                v-html="safeHtml(contentDrawer.content.value)"></n-h3>
              <n-input v-else ref="editTaskTitleRef" v-model:value="editTaskTitleValue" :placeholder="editTaskTitleValue"
                bordered :style="{ width: '90%', margin: '16px 5%' }" @change="editTaskTitleHide"
                @blur="editTaskTitleHide" />
              <div>
                <n-button text size="small" style="margin-right: 5px;"
                  @click="contentDrawer.content.isFinished = !contentDrawer.content.isFinished">
                  <template #icon>
                    <n-icon>
                      <CheckmarkIcon />
                    </n-icon>
                  </template>
                  {{ contentDrawer.content.isFinished ? '已完成' : '未完成' }}
                </n-button>
                <n-button type="tertiary" @click="contentDrawer.show = false"
                  style="width: 32px; height: 32px; margin-left: 5px;">
                  <template #icon>
                    <n-icon>
                      <CloseIcon />
                    </n-icon>
                  </template>
                </n-button>
              </div>
            </div>
            <n-space vertical>
              <n-list>
                <n-list-item>
                  <n-dynamic-input :value="contentDrawer.content.steps" @update:value="addSteps" @create="creatStep">
                    <template #create-button-default>
                      添加步骤
                    </template>
                    <template #default="{ value }">
                      <div style="display: flex; align-items: center; width: 100%">
                        <n-radio v-model:checked="value.isFinished" style="margin-right: 12px"
                          @click.stop="value.isFinished = !value.isFinished" />
                        <n-input v-model:value="value.value" type="text" />
                      </div>
                    </template>
                  </n-dynamic-input>
                </n-list-item>
                <n-list-item>
                  <n-button text block
                    :type="contentDrawer.content.isMyDay || contentDrawer.content.originMyDay ? 'error' : 'default'"
                    @click="contentDrawer.content.originMyDay ? deleteTask(contentDrawer.content.id) : (contentDrawer.content.isMyDay = !contentDrawer.content.isMyDay)">
                    <template #icon>
                      <n-icon>
                        <SunnyIcon />
                      </n-icon>
                    </template>
                    {{ contentDrawer.content.isMyDay || contentDrawer.content.originMyDay ? '从我的一天中移除' : '添加到我的一天' }}
                  </n-button>
                </n-list-item>
                <n-list-item>
                  <n-dropdown trigger="hover" :options="notifyMe.options" @select="notifyMe.handleSelect">
                    <n-button text block>
                      <template #icon>
                        <n-icon>
                          <NotificationIcon />
                        </n-icon>
                      </template>
                      {{
                        contentDrawer.content.notification ? '已于' + new
                          Date(contentDrawer.content.notification).toLocaleString() + "设置提醒" : '提醒我'
                      }}
                    </n-button>
                  </n-dropdown>
                  <n-modal v-model:show="notifyMe.custom.show" transform-origin="center">
                    <n-card style="width: 400px;" title="自定义时间" :bordered="false" size="huge" role="dialog"
                      aria-modal="true">
                      <n-date-picker panel v-model:value="notifyMe.custom.value" type="datetime"
                        @confirm="notifyMe.custom.handleSelect" />
                    </n-card>
                  </n-modal>
                </n-list-item>
              </n-list>
            </n-space>
            <div class="text-bottom-center">
              创建于{{ dateDescription(contentDrawer.content.creatTime as number) }}
            </div>
          </n-drawer-content>
        </n-drawer>
        <loadButton text="213123" />
        <!-- 如果搜索框有内容，则不显示 -->
        <div v-if="siderSearchValue.length <= 0">
          <div class="plan-bar">
            <h2 v-if="!titleInput" @click="titleEdit">{{ siderSelected.label }}</h2>
            <n-input v-else ref="titleInputRef" :placeholder="siderSelected.label" v-model:value="titleInputValue"
              @change="titleEdited" @blur="titleEdited">
              <template #prefix>
                <n-icon :component="PencilIcon" />
              </template>
            </n-input>
          </div>
          <n-space vertical>
            <!-- v-for和v-if不能同时在一个元素，创建一个div -->
            <div v-for="list in listData">
              <n-card v-if="!list.isFinished" @click="taskEdit(list.id)">
                <n-radio :checked="list.isFinished" :value="list.id" :name="list.value"
                  @click.stop="list.isFinished = !list.isFinished">
                </n-radio>
                &nbsp;
                <span style="font-size: 16px;" v-html="safeHtml(list.value)"></span>
              </n-card>
            </div>
          </n-space>
          <n-tag v-if="listFinished.length >= 1" round :bordered="false" type="success" style="margin: 16px 0;">
            已完成
            <template #icon>
              <n-icon :component="CheckmarkCircleIcon" />
            </template>
          </n-tag>
          <n-space vertical>
            <n-card v-for="list in listFinished" @click="taskEdit(list.id)">
              <n-radio :checked="list.isFinished" :value="list.id" :name="list.value"
                @click.stop="list.isFinished = !list.isFinished">
              </n-radio>
              &nbsp;
              <span style="font-size: 16px; text-decoration: line-through;" v-html="safeHtml(list.value)"></span>
            </n-card>
          </n-space>
        </div>
        <!-- 搜索结果 -->
        <div v-else>
          <div class="plan-bar">
            <h2>{{ siderSearchValue }}的搜索结果</h2>
          </div>
          <n-space vertical>
            <!-- v-for和v-if不能同时在一个元素，创建一个div -->
            <div v-for="list in listData.filter((item) => item.value.includes(siderSearchValue))">
              <n-card v-if="!list.isFinished" @click="taskEdit(list.id)">
                <n-radio :checked="list.isFinished" :value="list.id" :name="list.value"
                  @click.stop="list.isFinished = !list.isFinished">
                </n-radio>
                &nbsp;
                <span style="font-size: 16px;" v-html="safeHtml(list.value)"></span>
              </n-card>
            </div>
          </n-space>
          <n-tag v-if="listFinished.length >= 1" round :bordered="false" type="success" style="margin: 16px 0;">
            已完成
            <template #icon>
              <n-icon :component="CheckmarkCircleIcon" />
            </template>
          </n-tag>
          <n-space vertical>
            <n-card v-for="list in listFinished" @click="taskEdit(list.id)">
              <n-radio :checked="list.isFinished" :value="list.id" :name="list.value"
                @click.stop="list.isFinished = !list.isFinished">
              </n-radio>
              &nbsp;
              <span style="font-size: 16px; text-decoration: line-through;" v-html="safeHtml(list.value)"></span>
            </n-card>
          </n-space>
        </div>
        <n-layout-footer bordered position="absolute" v-if="collapsed || !config.isMobile"
          style="height: 64px; display: flex; align-items: center; padding: 6px 36px;">
          <n-input-group>
            <n-input placeholder="添加任务" v-model:value="newTaskValue" @blur="createNewList" @change="createNewList">
              <template #prefix>
                <n-icon :component="AddIcon" />
              </template>
            </n-input>
            <n-button strong secondary @click="createNewList">
              <n-icon>
                <AddIcon />
              </n-icon>
            </n-button>
          </n-input-group>
        </n-layout-footer>
      </n-layout>
    </n-layout>
</n-layout>
</template>