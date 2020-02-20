<template>
  <div class="section-header">
    <div class="section-mark" style="border-left-color: #1890FF;"></div>
    <div class="section-title">{{title}}</div>
  </div>
</template>

<script>
export default {
  name: 'SectionHeader',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped>
  .section-header {
    display: flex;
    -webkit-box-align: center;
    padding: 5px 15px;
    align-items: center;
  }
  .section-mark {
    border-left-width: 2px;
    border-left-style: solid;
    height: 12px;
  }
  .section-title {
    margin-left: 5px;
    padding: 0;
    box-sizing: border-box;
    color: black;
    font-size: 14px;
    font-weight: bold;
  }
</style>
