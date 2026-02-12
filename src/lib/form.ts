export type FormDataValue = Blob | boolean | null | number | string | undefined;

export const createFormData = (
    payload: Record<string, FormDataValue>
): FormData => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }

        if (value instanceof Blob) {
            formData.append(key, value);
            return;
        }

        formData.append(key, String(value));
    });

    return formData;
};
