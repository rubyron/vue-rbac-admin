// src/composables/useCancelableRequest.ts
import { ref } from "vue";

export function useCancelableRequest<TParams extends object, TResult>(
  fn: (params: TParams, signal: AbortSignal) => Promise<TResult>
) {
  const loading = ref(false);
  const error = ref<unknown>(null);

  let controller: AbortController | null = null;

  const run = async (params: TParams) => {
    controller?.abort();
    controller = new AbortController();

    loading.value = true;
    error.value = null;

    try {
        console.log('run',fn)
      return await fn(params, controller.signal);
    } catch (e: any) {
      // axios abort: err.code === 'ERR_CANCELED'
      if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
      error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const cancel = () => controller?.abort();

  return { run, cancel, loading, error };
}
