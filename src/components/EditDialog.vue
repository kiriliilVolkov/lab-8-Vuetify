<template>
  <v-dialog 
    :model-value="modelValue" 
    max-width="600px" 
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title>
        {{ title }}
      </v-card-title>
      
      <v-card-text>
        <v-form ref="form" v-model="isValid">
          <slot :form-data="formData" :is-edit="isEdit" />
        </v-form>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" @click="close">Отмена</v-btn>
        <v-btn color="primary" :disabled="!isValid" @click="save">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  title: string;
  isEdit: boolean;
  formData: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save'): void;
}>();

const form = ref();
const isValid = ref(false);

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      form.value?.resetValidation();
    }, 100);
  }
});

const close = () => {
  emit('update:modelValue', false);
  form.value?.reset();
};

const save = () => {
  form.value?.validate().then((result: boolean) => {
    if (result) {
      emit('save');
    }
  });
};
</script>