<template>
  <div
    v-show="showCommand"
    class="right-click"
    :style="`left: ${left}px; top: ${top}px; width: ${width}px`"
  >
    <ul>
      <li
        v-for="(command, index) in commandList"
        :key="index"
        @click="execCommand(command)"
      >
        {{ command.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'RightClick',
  props: {
    commandList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showCommand: false,
      left: 0,
      top: 0,
      width: 0
    };
  },
  methods: {
    /**
		 * 打开右键菜单
		 * @param {number} left 菜单左侧偏移
		 * @param {number} top 菜单顶部偏移
		 * @param {number} width 菜单宽度
		 */
    open(left, top, width = 110) {
      this.left = left;
      this.top = top;
      this.width = width;
      this.showCommand = true;
    },
    /**
		 * 关闭右键菜单
		 */
    close() {
      this.showCommand = false;
    },
    /**
		 * 执行选中的命令(由父组件执行)
		 * @param {string} command 要执行的命令的key
		 */
    execCommand(command) {
      this.close();
      this.$emit('handleExecCommand', command.commandKey);
    }
  }
};
</script>

<style lang="less" scoped>
.right-click {
    position: absolute;
    z-index: 500;
    background-color:#F0F0F0;
    width: 110px;
    ul {
        list-style-type: none;
        padding-left: 0;
        margin-bottom: 0;
    }
    li {
        cursor: pointer;
        padding: 4px 10px;
    }
    li:hover {
        background-color: #B0B0B0;

    }
}
</style>
