import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Button, MenuItem, IconButton, Typography } from '@mui/material';

import useMetaData from 'src/hooks/use-meta-data';

import { API_ROUTER } from 'src/utils/axios';
import { getTranslatedData } from 'src/utils/misc';

import { useLocales, useTranslate } from 'src/locales';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';
import { axiosPost, axiosPatch, axiosDelete } from 'src/services/axiosHelper';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFUpload, RHFSelect, RHFCheckbox, RHFTextField } from 'src/components/hook-form';

export default function BusinessMenuAddUpdateDialog({
  isEdit = false,
  open,
  onClose,
  fetchData = () => {},
  businessId = '',
  ...other
}) {
  const { t } = useTranslate();
  const [subCategories, isLoading] = useMetaData(API_ROUTER.getSubCategories(businessId));
  const [menuTypes, isTypesLoading] = useMetaData(API_ROUTER.menuType.list);

  // Form Config
  const categorySchema = Yup.object()
    .shape({
      Item_name: Yup.string()
        .trim('Enter valid name')
        .required('Name is required')
        .min(2, 'Name must be at least 2 character long')
        .max(50, 'Name must be at most 50 characters long')
        .matches(/^(?=.*[A-Za-z])[A-Za-z0-9 ]*$/, 'Name can only contains alphabets and numbers'),
      description: Yup.string()
        .trim('Enter valid description')
        .required('Description is required')
        .min(2, 'Description must be at least 2 character long')
        .max(1000, 'Description must be at most 1000 characters long')
        .matches(
          /^(?=.*[A-Za-z])[A-Za-z0-9 ]*$/,
          'Description can only contains alphabets and numbers'
        ),
      cover_image: Yup.mixed()
        .test('isExist', 'Cover Image is required', (value) => !!value)
        .test('fileSize', 'Cover Image must be less than 3MB', (value) =>
          // eslint-disable-next-line no-nested-ternary
          value ? (typeof value !== 'string' ? value.size <= 3 * 1024 * 1024 : true) : false
        )
        .test('fileType', 'Cover Image is invalid', (value) =>
          // eslint-disable-next-line no-nested-ternary
          value
            ? typeof value !== 'string'
              ? ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'].includes(value?.type)
              : true
            : false
        ),
      sub_category: Yup.string().required('Sub Category is required'),
      price: Yup.number().required('Price is required'),
      is_veg: Yup.bool(),
      menu_type: Yup.string().required('Menu type is required'),
      ingredients: Yup.array()
        .of(Yup.object().shape({ ingredients: Yup.string().required('Ingredient is required') }))
        .min(1, 'Ingredients are required'),
    })
    .required()
    .strict(true);

  const defaultValues = useMemo(
    () => ({
      Item_name: isEdit?.Item_name || '',
      description: isEdit?.description || '',
      cover_image: isEdit?.cover_image || '',
      price: isEdit.price ? +isEdit.price : 0,
      is_veg: isEdit?.is_veg || false,
      sub_category: isEdit ? isEdit?.sub_category?.id?.toString() : '',
      menu_type: isEdit ? isEdit?.menu_type?.id?.toString() : '',
      ingredients: isEdit
        ? isEdit?.item_ingredients?.map((item) => ({ ...item, key: item.id }))
        : [{ ingredients: '' }],
    }),
    [isEdit]
  );

  const methods = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues,
  });
  const { enqueueSnackbar } = useSnackbar();
  const { currentLang } = useLocales();

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    reset,
    control,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  useEffect(() => {
    reset({ ...defaultValues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const onCloseDialog = () => {
    reset({ name: '', icon: '' });
    onClose();
  };

  const onEditMenu = async (formData) => {
    try {
      const {
        cover_image,
        Item_name,
        ingredients,
        price,
        description,
        is_veg,
        sub_category,
        menu_type,
      } = formData;

      const payload = new FormData();

      if (Item_name !== isEdit?.Item_name) payload.append('Item_name', Item_name);
      if (description !== isEdit?.description) payload.append('description', description);
      if (is_veg !== isEdit?.is_veg) payload.append('is_veg', is_veg);
      // eslint-disable-next-line eqeqeq
      if (price != isEdit?.price) payload.append('price', +price);
      // eslint-disable-next-line eqeqeq
      if (cover_image != isEdit?.cover_image) payload.append('cover_image', cover_image);

      // eslint-disable-next-line eqeqeq
      if (menu_type != isEdit?.menu_type) payload.append('menu_type', menu_type);
      // eslint-disable-next-line eqeqeq
      if (sub_category != isEdit?.sub_category?.id) payload.append('sub_category', sub_category);

      const toDeleteIngredients = [];

      if (isEdit?.item_ingredients?.length > 0) {
        isEdit?.item_ingredients?.forEach((item) => {
          // eslint-disable-next-line eqeqeq
          if (!ingredients.some((ing) => ing?.ingredients == item?.ingredients))
            toDeleteIngredients.push(item.id);
        });
      }

      if (ingredients?.length > 0) {
        ingredients.forEach((item) => {
          // eslint-disable-next-line eqeqeq
          if (!isEdit?.item_ingredients.some((ing) => ing?.ingredients == item?.ingredients))
            payload.append(`ingredients`, item?.ingredients);
        });
      }

      const res = await axiosPatch(
        API_ROUTER.business.menus.update(businessId, isEdit.id),
        payload,
        'multipart/form-data'
      );

      if (!res.status) {
        return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }
      if (res.status) {
        if (toDeleteIngredients?.length > 0) {
          await Promise.all(
            toDeleteIngredients.map(async (ing) => {
              await axiosDelete(API_ROUTER.removeBusinessMenuIngredientItem(businessId, ing));
            })
          );
        }
        enqueueSnackbar(TOAST_ALERTS.BUSINESS_MENU_UPDATE_SUCCESS, {
          variant: TOAST_TYPES.SUCCESS,
        });
        onCloseDialog();
        fetchData();
      }
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
        variant: TOAST_TYPES.ERROR,
      });
    }
    return null;
  };

  const onAddMenu = async (formData) => {
    try {
      const {
        cover_image,
        Item_name,
        ingredients,
        price,
        description,
        is_veg,
        sub_category,
        menu_type,
      } = formData;

      const payload = new FormData();

      payload.append('Item_name', Item_name);
      payload.append('description', description);
      payload.append('is_veg', is_veg);
      payload.append('price', +price);
      payload.append('cover_image', cover_image);
      payload.append('sub_category', sub_category);
      payload.append('menu_type', menu_type);

      if (ingredients?.length > 0) {
        ingredients.forEach((item) => payload.append(`ingredients`, item?.ingredients));
      }

      const res = await axiosPost(
        API_ROUTER.business.menus.create(businessId),
        payload,
        'multipart/form-data'
      );

      if (!res.status) {
        return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }
      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.BUSINESS_MENU_CREATE_SUCCESS, {
          variant: TOAST_TYPES.SUCCESS,
        });
        onCloseDialog();
        fetchData();
      }
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
        variant: TOAST_TYPES.ERROR,
      });
    }
    return null;
  };

  const onSubmit = async (formData) => {
    if (isEdit) onEditMenu(formData);
    else onAddMenu(formData);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('cover_image', newFiles[0], { shouldValidate: true });
    },
    [setValue]
  );

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onCloseDialog} {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
          {isEdit ? 'Update' : 'Add'} Menu
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Stack spacing={3}>
            <RHFTextField fullWidth name="Item_name" label="Menu Name" />
            <RHFTextField fullWidth name="description" label="Menu Description" />
            <RHFTextField
              fullWidth
              name="price"
              label="Price"
              type="number"
              InputProps={{ inputProps: { min: 1, max: 100000000 } }}
            />
            <RHFSelect name="sub_category" label="Sub Category" disabled={isLoading}>
              <MenuItem>Select Sub Category</MenuItem>
              {subCategories &&
                subCategories.length > 0 &&
                subCategories.map((item) => (
                  <MenuItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </MenuItem>
                ))}
            </RHFSelect>

            <RHFCheckbox name="is_veg" label="Is Veg?" />

            <RHFSelect name="menu_type" label="Type" disabled={isTypesLoading}>
              <MenuItem>Select Type</MenuItem>
              {menuTypes &&
                menuTypes.length > 0 &&
                menuTypes.map((item) => (
                  <MenuItem key={item.id} value={item.id.toString()}>
                    {getTranslatedData(currentLang, item, 'type')}
                  </MenuItem>
                ))}
            </RHFSelect>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" color={errors?.ingredients ? 'error' : 'default'}>
                Ingredients
              </Typography>
              <Stack gap={2} alignItems="flex-start">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => append({ ingredients: '' })}
                >
                  Add Ingredient
                </Button>
                {fields.map((field, index) => (
                  <Stack direction="row" alignItems="center" gap={3}>
                    <RHFTextField
                      name={`ingredients[${index}].ingredients`}
                      label="Ingredient"
                      placeholder="Entre ingredient"
                      disabled={!!field.key}
                    />
                    <IconButton color="error" onClick={() => remove(index)}>
                      <Iconify icon="tabler:trash" />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Cover Image</Typography>
              <RHFUpload
                multiple={false}
                thumbnail
                name="cover_image"
                maxSize={3145728}
                onDrop={handleDrop}
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack direction="row" justifyContent="flex-end" flexGrow={1} gap={2}>
            <Button variant="outlined" onClick={onCloseDialog}>
              {t('category.update_menu.form.button.cancel')}
            </Button>
            <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
              {isEdit
                ? t('category.update_menu.form.button.update')
                : t('category.update_menu.form.button.create')}
            </LoadingButton>
          </Stack>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

BusinessMenuAddUpdateDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool,
  fetchData: PropTypes.func.isRequired,
  businessId: PropTypes.string.isRequired,
};
