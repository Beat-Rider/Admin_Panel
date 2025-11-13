<template>
  <q-page padding>
    <div class="q-pa-md" style="max-width: 400px; margin: auto">
      <q-card flat bordered class="q-pa-lg shadow-2">
        <q-form @submit.prevent="updateData">
          <div>
            <div class="text-center q-mb-xs" style="margin-bottom: 2vh">
              Введіть Дані Що Бажаєте Редагувати
            </div>

            <q-file
              v-model="form.photo"
              accept="image/*"
              label="Оберіть Одне Фото"
              outlined
              use-chips
              @update:model-value="previewImage"
              style="margin-bottom: 2vh"
            />

            <!-- Попередній перегляд -->
            <q-img
              v-if="photoPreview"
              :src="photoPreview"
              class="q-mt-md"
              style="max-width: 300px; border-radius: 8px; margin-bottom: 2vh"
            />
          </div>

          <q-input
            v-model="form.name"
            label="Ім'я"
            type="text"
            outlined
            :rules="optionalNameRules"
            @input="cleanName('name')"
            class="q-mb-md"
          />
          <q-input
            v-model="form.surname"
            label="Прізвище"
            type="text"
            outlined
            :rules="optionalNameRules"
            @input="cleanName('surname')"
            class="q-mb-md"
          />
          <q-input
            v-model="form.midName"
            label="По-Батькові"
            type="text"
            outlined
            :rules="optionalNameRules"
            @input="cleanName('midName')"
            class="q-mb-md"
          />
          <q-input
            v-model="form.callSign"
            label="Позивний"
            type="text"
            outlined
            :rules="optionalNameRules"
            @input="cleanName('callSign')"
            class="q-mb-md"
          />

          <q-input
            v-model="form.b_date"
            label="Дата народження"
            outlined
            readonly
            @click="showBirthDate = true"
            class="q-mb-md"
          >
            <template #append>
              <q-icon name="event" />
            </template>
          </q-input>

          <q-dialog v-model="showBirthDate">
            <q-card>
              <q-date
                v-model="form.b_date"
                mask="DD.MM.YYYY"
                @update:model-value="showBirthDate = false"
              />
            </q-card>
          </q-dialog>

          <q-input
            v-model="form.place"
            label="Місце Народження"
            type="text"
            outlined
            :rules="optionalNameRules"
            @input="cleanName('place')"
            class="q-mb-md"
          />

          <q-input
            v-model="form.d_date"
            label="Дата Смерті"
            outlined
            readonly
            @click="showDeathDate = true"
            class="q-mb-md"
          >
            <template #append>
              <q-icon name="event" />
            </template>
          </q-input>

          <q-dialog v-model="showDeathDate">
            <q-card>
              <q-date
                v-model="form.d_date"
                mask="DD.MM.YYYY"
                @update:model-value="showDeathDate = false"
              />
            </q-card>
          </q-dialog>

          <q-input v-model="form.rank" label="Звання" type="text" outlined class="q-mb-md" />

          <q-input
            v-model="form.lifeStory"
            label="Життєва Історія"
            type="textarea"
            outlined
            autogrow
            maxlength="1000"
            counter
            :rules="lifeStoryRules"
            class="q-mb-md"
          />

          <div class="text-h6 text-center q-mb-md">Координати Поховання</div>

          <q-input
            v-model="form.coords"
            label="Координати (Lat, Lng)"
            outlined
            @update:model-value="autoFormatCoords"
            :rules="coordsRules"
            maxlength="20"
            class="q-mb-s"
          ></q-input>

          <div v-if="coordsValid" class="q-mb-md" style="display: flex; justify-content: center">
            <q-btn
              :href="form.mapLink"
              target="_blank"
              color="primary"
              label="Відкрити на карті"
              class="full-width"
              style="max-width: 400px"
            />
          </div>

          <q-input
            v-model="form.address"
            label="Адреса Могили"
            type="textarea"
            outlined
            class="q-mb-md"
          />

          <q-btn type="submit" label="Зберегти" color="primary" class="full-width" />
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar'

console.log('updateData RUN')

//  Дані людини ("база" в памʼяті)
const user = ref({
  photo: null,
  name: '',
  surname: '',
  midName: '',
  callSign: '',
  b_date: '',
  place: '',
  d_date: '',
  rank: '',
  lifeStory: '',
  Latitude: '',
  Longitude: '',
  address: '',
})

const form = ref({
  photo: null,
  name: '',
  surname: '',
  midName: '',
  callSign: '',
  b_date: '',
  place: '',
  d_date: '',
  rank: '',
  lifeStory: '',
  Latitude: '',
  Longitude: '',
  address: '',
})

// Часткове оновлення (тільки ті поля, які користувач ввів)

function fieldName(key) {
  const names = {
    name: "Ім'я",
    surname: 'Прізвище',
    midName: 'По-батькові',
    callSign: 'Позивний',
    place: 'Місце Народження',
    lifeStory: 'Життєва Історія',
    b_date: 'Дата Народження',
    d_date: 'Дата Смерті',
    rank: 'Звання',
    Latitude: 'Широта',
    Longitude: 'Довгота',
    address: 'Адреса',
    photo: 'Фото',
  }
  return names[key] || key
}

function updateData() {
  const changes = [] // список змінених полів

  for (const key in form.value) {
    const newValue = form.value[key]
    const oldValue = user.value[key]

    // пропускаємо пусті значення
    if (
      newValue === '' ||
      newValue === null ||
      (typeof newValue === 'string' && newValue.trim() === '')
    ) {
      continue
    }

    // якщо значення реально змінилось
    if (newValue !== oldValue) {
      changes.push({
        field: key,
        before: oldValue,
        after: typeof newValue === 'string' ? newValue.trim() : newValue,
      })

      // оновлюємо значення
      user.value[key] = typeof newValue === 'string' ? newValue.trim() : newValue
    }
  }

  // ✅ Notify з логом змін
  if (changes.length > 0) {
    const message = changes
      .map((c) => `• ${fieldName(c.field)}: "${c.before || '-'}" → "${c.after}"`)
      .join('<br>')

    Notify.create({
      message: `✅ Зміни збережено:<br>${message}`,
      color: 'green-7',
      html: true,
      position: 'top',
      icon: 'check_circle',
      timeout: 10000,
    })
  } else {
    Notify.create({
      message: 'ℹ️ Ви не змінили жодного поля',
      color: 'amber-8',
      icon: 'warning',
      position: 'top',
    })
  }

  // очищення форми
  for (const key in form.value) {
    form.value[key] = key === 'photo' ? null : ''
  }
}

// Попередній Перегляд Фото

const photoPreview = ref(null)

const previewImage = (file) => {
  if (file) {
    photoPreview.value = URL.createObjectURL(file)
  } else {
    photoPreview.value = null
  }
}

// Правила валідації

const optionalNameRules = [
  (v) => v === '' || v.trim().length >= 2 || 'Мінімум 2 літери',
  (v) =>
    v === '' ||
    /^[А-ЯІЇЄҐ][А-Яа-яІЇЄҐіїєґʼ' -]+$/.test(v) ||
    'Перша Велика. Українська. Дефіс та апостроф дозволені.',
]

// Функція авто-корекції з підтримкою подвійних імен
const cleanName = (field) => {
  let value = form.value[field]
  if (!value) return

  // 1. Видаляємо все зайве (цифри, латиницю, спецсимволи)
  value = value.replace(/[^А-Яа-яІЇЄҐіїєґʼ' -]/g, '')

  // 2. Видаляємо зайві пробіли (залишаємо один)
  value = value.replace(/\s+/g, ' ').trim()

  // 3. Видаляємо подвійні дефіси та апострофи
  value = value.replace(/-{2,}/g, '-')
  value = value.replace(/[’']{2,}/g, "'")

  // 4. Форматуємо кожне слово та кожну частину після дефісу
  value = value
    .split(' ') // розбиваємо по пробілу
    .map((part) =>
      part
        .split('-') // розбиваємо по дефісу
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join('-'),
    )
    .join(' ')

  form.value[field] = value
}

// Дата народження / смерті
const showBirthDate = ref(false)
const showDeathDate = ref(false)

// Життєва Історія
const lifeStoryRules = [
  (v) => v === '' || v.length <= 1000 || 'Максимум 1000 символів',
  (v) => v === '' || v.length >= 50 || 'Мінімум 50 символів',
]

function autoFormatCoords() {
  let v = form.value.coords || ''

  // лишаємо тільки цифри, кому, мінус і пробіли
  v = v
    .replace(/[^0-9, ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  // Максимум 16 цифр усього (без урахування розділових знаків)
  const onlyDigits = v.replace(/[^0-9]/g, '')
  if (onlyDigits.length > 16) {
    // відсікаємо зайві цифри
    const extra = onlyDigits.length - 16
    v = v.slice(0, v.length - extra)
  }

  // якщо користувач ввів лише цифри (наприклад 4938223737421123)
  // і довжина >= 14 — автоматично ділимо навпіл
  if (/^\d{16}$/.test(v)) {
    const mid = Math.floor(v.length / 2)
    v = v.slice(0, mid) + ' ' + v.slice(mid)
  }

  // розбиваємо на частини по пробілу або комі
  const parts = v.split(/[,\s]+/).slice(0, 2)

  const fmt = (s) => {
    if (!s) return ''
    let sign = s.startsWith('-') ? '-' : ''
    s = sign ? s.slice(1) : s
    s = s.replace(/\./g, '') // прибираємо старі крапки
    if (s.length <= 2) return sign + s
    return sign + s.slice(0, 2) + '.' + s.slice(2)
  }

  const lat = fmt(parts[0])
  const lng = parts[1] !== undefined ? fmt(parts[1]) : ''

  // Якщо є друга частина — додаємо ", "
  form.value.coords = lng ? `${lat}, ${lng}` : lat

  // Перевірка на валідність
  validateCoords()
}

const coordsValid = ref(false)

function validateCoords() {
  const v = form.value.coords
  // формат: 12.345..., 12.345... (мінус також дозволений)
  const pattern = /^\d{2}\.\d{2,},\s\d{2}\.\d{2,}$/
  coordsValid.value = pattern.test(v)

  if (coordsValid.value) {
    const [lat, lng] = v.split(',').map((s) => s.trim())
    form.value.mapLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  } else {
    form.value.mapLink = ''
  }
}

const coordsRules = [
  (v) => v.replace(/[^0-9]/g, '').length >= 16 || 'Мінімум 16 цифр',
  (v) => v.replace(/[^0-9]/g, '').length <= 16 || 'Максимум 16 цифр',
  (v) => /^-?\d{2}\.\d{2,},\s-?\d{2}\.\d{2,}$/.test(v) || 'Невірний формат координат',
]
</script>
