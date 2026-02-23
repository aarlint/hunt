import { ref } from 'vue'

export function useApi(url) {
  const data = ref(null)
  const loading = ref(true)
  const error = ref(null)

  async function fetch_data() {
    loading.value = true
    try {
      const res = await fetch(url)
      data.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  fetch_data()
  return { data, loading, error, refresh: fetch_data }
}

export async function postApi(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  return res.json()
}
