<script setup>
const props = defineProps({
  initValue: {
    Type: String,
    default: 'no',
  },
  disabled: {
    Type: Boolean,
    default: true,
  }
})

const emit = defineEmits(['change'])

const toggle = ref(props.initValue)

watch(toggle, (value) => {
  emit('change', value)
})
</script>

<template>
    <label class="switch">
        <input :disabled="props.disabled" type="checkbox" v-model="toggle" true-value="yes" false-value="no">
        <span :class="{enabled: !props.disabled}" class="slider round"></span>
    </label>
</template>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  /*width: 60px;
  height: 34px;*/
  width: 48px;
  height: 28px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #3336;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  /*height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;*/
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: #9996;
  -webkit-transition: .4s;
  transition: .4s;
}

.enabled {
  background-color: #999;/*#ccc*/
}
.enabled:before {
  background-color: #eee;/*#fff*/
}

input:checked + .slider {
  background-color: #2196F399;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F399;
}

input:checked + .slider:before {
  /*-webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);*/
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>