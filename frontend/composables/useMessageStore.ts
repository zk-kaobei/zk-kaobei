export const useMessageStore = defineStore('messagestore', () => {
    const message = ref('')

    const snackbar = computed({
        get: () => !!message.value,
        set: (v) => {
            if (!v) message.value = ''
        }
    })

    return {
        message,
        snackbar,
    }
})
