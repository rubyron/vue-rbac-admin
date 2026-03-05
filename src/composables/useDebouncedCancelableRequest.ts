// src/composables/useDebouncedCancelableRequest.ts
import { ref } from "vue";

export function useDebouncedCancelableRequest<TParams extends object, TResult>(
  fn: (params: TParams, signal: AbortSignal) => Promise<TResult>,
  delay = 300
) {
  const loading = ref(false);
  const error = ref<unknown>(null);

  let timer: number | undefined;
  let controller: AbortController | null = null;

  const run = (params: TParams) =>
    new Promise<TResult | void>((resolve, reject) => {
      if (timer) window.clearTimeout(timer);

      timer = window.setTimeout(async () => {
        controller?.abort();
        controller = new AbortController();

        loading.value = true;
        error.value = null;

        try {
          const res = await fn(params, controller.signal);
          resolve(res);
        } catch (e: any) {
          if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return resolve();
          error.value = e;
          reject(e);
        } finally {
          loading.value = false;
        }
      }, delay);
    });

  const cancel = () => controller?.abort();

  return { run, cancel, loading, error };
}
