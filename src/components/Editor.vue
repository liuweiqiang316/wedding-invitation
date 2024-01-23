<template>
  <div class="wedding-editor" ref="editorRef">
    <header class="editor-header">
      <a href="javascript:;"></a>
      <a href="javascript:;" class="minimum"></a>
      <a href="javascript:;" class="maximum"></a>
    </header>
    <!-- 日期 -->
    <p class="code">Last login: <span>{{ startDate }}</span> on ttys001</p>
    <!--代码编辑区-->
    <pre>
      <code v-html="highlightedCode"></code>
    </pre>
    <!-- 打开邀请函 -->
    <div class="editor-open" v-if="(canStart || hasClosed) && !canOpen" @click="canOpen = true">
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"
        stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="3" x2="9" y2="21"></line>
      </svg>
    </div>
    <Executions :canExecute="canExecute" @onUpdating="scrollToBottom" @onFinish="canOpen = true" />
    <invitation :canOpen="canOpen" @onClose="canOpen = false, hasClosed = true" @sendBarrage="onAfterSending" />
    <Barrage :wish="wish" :canStart="canStart" />
    <Like />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated } from "vue"
import Prism from 'prismjs'
import 'prismjs/themes/prism-okaidia.css'
import '../utils/raf'
import data from '../mock/data'
import Like from './like/Like.vue'

import Executions from './Executions.vue'
import Invitation from './Invitation.vue'
import Barrage from './Barrage.vue'

const editorRef = ref()

const startDate = ref('')
const code = ref(data.code)
const currentCode = ref('')
const isCursorVisible = ref(1)
const canExecute = ref(false)
const canOpen = ref(false)
const wish = ref('')
const hasClosed = ref(false)
const canStart = ref(false)

const progressivelyTyping = () => {
  return new Promise((resolve) => {
    let count = 0, typingCount = 0, typing
    // 写代码每一帧的函数
    let step = () => {
      let randomNumber = Math.round(Math.random() * 6)
      // 模拟打字的随机速度
      if (count % 2 === 0 && randomNumber % 4 === 0) {
        currentCode.value = code.value.substring(0, typingCount)
        typingCount++
      }
      // 大约每 24 帧光标闪动一次
      if (count % 24 === 0) {
        isCursorVisible.value = isCursorVisible.value === 0 ? 1 : 0
      }
      count++
      if (typingCount <= code.value.length) {
        typing = requestAnimationFrame(step)
      } else {
        resolve()
        canExecute.value = true
        cancelAnimationFrame(typing)
      }
    }
    typing = requestAnimationFrame(step)
  })
}

const scrollToBottom = () => {
  // 保持页面一直滚到最下面
  editorRef.value.scrollTop = 100000
}

const highlightedCode = computed(() => {
  const code = Prism.highlight(
    currentCode.value,
    Prism.languages.javascript
  )
  const codeWithCursor = `${code}<span style="opacity:${isCursorVisible.value}"> ▍</span>`

  return codeWithCursor
})

const onAfterSending = (w) => {
  wish.value = w
  canOpen.value = false
  setTimeout(() => {
    canStart.value = true
  }, 800)
}
onMounted(() => {
  startDate.value = new Date().toDateString()
  progressivelyTyping()
})

onUpdated(() => {
  scrollToBottom()
})

</script>

<style lang="less">
.wedding-editor {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 15px;
  padding-top: 50px;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1;
  transform-origin: 0 0;
  -webkit-transform-origin: 0 0;
  transition: all 1.6s cubic-bezier(0.4, 0, 1, 1);
  -webkit-transition: all 1.6s cubic-bezier(0.4, 0, 1, 1);

  .editor-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 12px;
    overflow: hidden;
    background: #2B2B48;
    z-index: 3;

    >a {
      float: left;
      display: block;
      width: 16px;
      height: 16px;
      margin-right: 5px;
      border-radius: 8px;
      background: #FC615D;

      &.minimum {
        background: #FDBC40;
      }

      &.maximum {
        background: #34C84A;
      }
    }
  }

  p.code {
    margin: 0;
    color: #BBB;
    line-height: 1.2;
    font-family: 'Roboto Mono', 'Menlo', 'Monaco', Courier, monospace !important;
    font-weight: 500 !important;
    font-size: 16px !important;
  }

  pre {
    margin: 0;
    white-space: pre-wrap;

    code {
      white-space: pre-wrap;
      word-break: break-all;
      font-size: 16px !important;
      margin: 0;
      color: #BBB;
      line-height: 1.2;
      font-family: 'Roboto Mono', 'Menlo', 'Monaco', Courier, monospace !important;
      font-weight: 500 !important;
      background: transparent;
    }
  }

  .editor-open {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 40px;
    height: 40px;
    padding: 6px;
    border-radius: 20px;
    text-align: center;
    line-height: 18px;
    border: 5px solid #ffd69b;
    color: #a9895d;
    background: #FFF1DE;
    z-index: 1000;
  }
}
</style>
