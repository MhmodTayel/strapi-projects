//@ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  BaseHeaderLayout,
  Layout,
  ContentLayout,
  Box,
  Field,
  FieldHint,
  Flex,
  FieldLabel,
  FieldInput,
  FieldError,
  Select,
  Option,
  Button,
  Checkbox,
  MultiSelect,
  MultiSelectOption,
  Divider,
} from '@strapi/design-system';
import { useParams, useHistory } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import api from '../../api';
import { ChevronLeft } from '@strapi/icons';
import qs from 'qs';
import UploadFile from '../../components/UploadFile';
import _ from 'lodash';

const divisions = [
  'نقد',
  'مكياج',
  'مساعد اخراج مسرحى',
  'كتاب مسرح',
  'فنون شعبية',
  'عرائس',
  'سيرك',
  'ديكور',
  'تمثيل',
  'تلقين',
  'باليه',
  'اخراج مسرحى',
  'اخراج اذاعى',
  'ادارة مسرحية',
];

export default function CreateRequestPage() {
  const { slug: serviceSlug } = useParams<{
    slug: string;
  }>();

  const history = useHistory();

  const {
    register: registerStepOne,
    handleSubmit: handleSubmitStepOne,
    setValue: setValueStepOne,
    formState: formStateStepOne,
    setError: setErrorStepOne,
    clearErrors: clearErrorsStepOne,
    getValues: getValuesStepOne,
  } = useForm();
  const { errors: errorsStepOne } = formStateStepOne;
  const {
    register: registerStepTwo,
    handleSubmit: handleSubmitStepTwo,
    setValue: setValueStepTwo,
    formState: formStateStepTwo,
    setError: setErrorStepTwo,
    clearErrors: clearErrorsStepTwo,
    getValues: getValuesStepTwo,
  } = useForm<any>({ defaultValues: { renewWithClub: true } });
  const { errors: errorsStepTwo } = formStateStepTwo;

  const {
    name: nameDivision,
    ref: refDivision,
    onChange: onChangeDivision,
    onBlur: onBlurDivision,
  } = registerStepOne('division', {
    required: 'برجاء اختيار الشعبة',
  });

  const {
    name: nameMedical,
    ref: refMedical,
    onChange: onChangeMedical,
    onBlur: onBlurMedical,
  } = registerStepTwo('medicalMembers');
  const [step, setStep] = useState(1);
  const [selectDivision, setSelectDivision] = useState('');
  const [selectMedical, setSelectMedical] = useState('');
  const [medical, setMedical] = useState(false);
  const [member, setMember] = useState<any>({});
  const [childrenFiles, setChildrenFiles] = useState<any>([]);
  const [formData, setFormData] = useState({
    // Your form fields
  });

  const onSubmitStepOne = async (data) => {
    try {
      if (step === 1) {
        const isValid = await validateMember(data);

        if (isValid) {
          setStep(2);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (!selectMedical.includes('wife')) {
      ['wifeAttachments', 'nationalIDFront', 'nationalIDBack'].forEach(
        (field) => {
          setValueStepTwo(field, null);
        }
      );
    }
    if (!selectMedical.includes('children')) {
      ['children', 'childrenAttachments'].forEach((field) => {
        setValueStepTwo(field, null);
      });
    }
  }, [selectMedical]);

  const onSubmitStepTwo = async (data) => {
    const chiledFields = ['children', 'childrenAttachments'];

    const wifeFields = ['wifeAttachments', 'nationalIDFront', 'nationalIDBack'];
    const errors: any = [];
    const values = getValuesStepTwo();
    if (values.renewWithMedical) {
      if (values.medicalMembers?.includes('wife')) {
        wifeFields.forEach((field) => {
          if (!values[field]) errors.push(field);
        });
      }
      if (values.medicalMembers?.includes('children')) {
        chiledFields.forEach((field) => {
          if (!values[field]) errors.push(field);
        });
      }
    }

    if (errors.length) {
      errors.forEach((error) => {
        switch (error) {
          case 'wifeAttachments':
            setErrorStepTwo(error, {
              message: 'برجاء ادخال شهادة تامينات ان الزوجة لا تعمل',
            });

            break;

          case 'nationalIDFront':
            setErrorStepTwo(error, {
              message: 'برجاء ادخال صورة بطاقة الزوجة امامي',
            });

            break;

          case 'nationalIDBack':
            setErrorStepTwo(error, {
              message: 'برجاء ادخال صورة بطاقة الزوجة خلفي',
            });

            break;

          case 'childrenAttachments':
            setErrorStepTwo(error, {
              message: 'برجاء ادخال المرفقات المطلوبة',
            });

            break;

          default:
            setErrorStepTwo(error, { message: 'هذا الحقل مطلوب' });

            break;
        }
      });

      return;
    }

    try {
      if (step === 2) {
        const stepOneValues = getValuesStepOne();
        await submitDataToBackend({
          ...data,
          ...stepOneValues,
          admin: true,
          member: _.omit(member, ['renewalRequests', 'user']),
        });
      }
    } catch (error) {}
  };
  const validateMember = async (data) => {
    const filters = {
      $and: [
        { syndicateID: { $eq: +data.syndicateID } },
        { division: { $eq: data.division } },
      ],
    };
    const query = qs.stringify({ filters });
    const { results } = (await api.getMember(query)) as any;
    const member = results[0];
    setMember(member);
    if (!member) {
      setErrorStepOne('serverError', {
        message: 'برجاء التاكد من الشعبة او رقم العضوية',
        type: 'serverError',
      });
      return false;
    } else if (member.disabled) {
      setErrorStepOne('serverError', {
        message: 'لا يمكن التجديد لهذا العضو',
        type: 'serverError',
      });
      return false;
    } else if (member.active || member.renewalRequestStatus == 'done') {
      setErrorStepOne('serverError', {
        message: 'تم التجديد لهذا العضو بالفعل',
        type: 'serverError',
      });
      return false;
    } else if (member.renewalRequestStatus == 'processing') {
      setErrorStepOne('serverError', {
        message: 'هذا العضو لديه طلب بالفعل',
        type: 'serverError',
      });
      return false;
    } else return true;
  };

  const submitDataToBackend = async (data) => {
    const res: any = await api.createRequest(
      serviceSlug,
      _.omitBy(data, _.isNil)
    );
    if (res.id) {
      history.push(
        '/plugins/services/api::soa-request-renewal.soa-request-renewal'
      );
    }
  };
  return (
    <div className="services">
      <Layout>
        <BaseHeaderLayout
          title="انشاء طلب جديد"
          subtitle="تقديم طلب تجديد اشتراك النقابه بالنيابة عن العضو"
          as="h2"
        />
        <ContentLayout>
          <form onSubmit={handleSubmitStepOne(onSubmitStepOne)}>
            {step === 1 && (
              <div style={{ width: '100%' }}>
                <Box padding={5} background="neutral0">
                  <Field
                    style={{ width: '500px' }}
                    error={
                      errorsStepOne?.syndicateID?.message
                      //  ||
                      // (fieldData.id == errors?.serverError?.type &&
                      //   errors?.serverError?.message)
                    }
                  >
                    <Flex direction="column" alignItems="stretch" gap={1}>
                      <FieldLabel required={true}>رقم العضوية</FieldLabel>
                      <FieldInput
                        type="text"
                        variant="epsilon"
                        {...registerStepOne('syndicateID', {
                          required: 'برجاء ادخال رقم عضوية',
                          pattern: {
                            value: /^[0-9]+$/,
                            message: 'برجاء كتابه رقم صحيح',
                          },
                        })}
                      />
                      <FieldError />
                      <FieldHint />
                    </Flex>
                  </Field>
                </Box>
                <Box padding={5} background="neutral0">
                  <Field
                    style={{ width: '500px' }}
                    error={errorsStepOne?.division?.message}
                  >
                    <Flex direction="column" alignItems="stretch" gap={1}>
                      <Select
                        variant="epsilon"
                        required={true}
                        label={'الشعبة'}
                        name={nameDivision}
                        ref={refDivision}
                        onBlur={onBlurDivision}
                        value={selectDivision}
                        onChange={(value) => {
                          setSelectDivision(value);
                          return onChangeDivision({
                            target: { name: nameDivision, value },
                            type: 'text',
                          });
                        }}
                      >
                        {divisions.map((div) => (
                          <Option style={{ direction: 'rtl' }} value={div}>
                            {div}
                          </Option>
                        ))}
                      </Select>
                      <FieldError />
                      <FieldHint />
                    </Flex>
                  </Field>
                </Box>
                <Box
                  padding={5}
                  background="neutral0"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: '100px',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    endIcon={<ChevronLeft />}
                    onClick={() => clearErrorsStepOne('serverError')}
                    type="submit"
                  >
                    الخطوة التالية
                  </Button>
                  <Field
                    error={errorsStepOne?.serverError?.message}
                    style={{ marginTop: '20px' }}
                  >
                    <FieldError />
                  </Field>
                </Box>
              </div>
            )}
          </form>
          <form onSubmit={handleSubmitStepTwo(onSubmitStepTwo)}>
            {step === 2 && (
              <div>
                <Box padding={5} background="neutral0">
                  <Field
                    style={{ width: '500px' }}
                    error={errorsStepTwo?.renewWithClub?.message}
                  >
                    <Flex direction="row" alignItems="stretch" gap={10}>
                      <Checkbox
                        checked
                        value={true}
                        disabled
                        style={{ margin: '0' }}
                        {...registerStepTwo('renewWithClub')}
                        className="checkBox"
                      >
                        <span style={{ padding: '10px' }}>
                          تجديد اشتراك العضوية والنادى{' '}
                        </span>
                      </Checkbox>
                      <Checkbox
                        style={{ margin: '0' }}
                        className="checkBox"
                        onValueChange={(value) => {
                          setValueStepTwo('renewWithMedical', !medical);
                          setMedical(!medical);
                        }}
                        value={medical}
                      >
                        <span style={{ padding: '10px' }}>الطبي </span>
                      </Checkbox>
                      <FieldError />
                      <FieldHint />
                    </Flex>
                  </Field>
                </Box>
                {medical && (
                  <Box padding={5} background="neutral0">
                    <Field
                      style={{ width: '300px' }}
                      className={'field'}
                      error={errorsStepTwo?.medicalMembers?.message}
                    >
                      <MultiSelect
                        withTags
                        variant="epsilon"
                        placeholder="الاعضاء التابعين فى الطبى (اختياري)"
                        name={nameMedical}
                        ref={refMedical}
                        onBlur={onBlurMedical}
                        value={selectMedical}
                        onChange={(value) => {
                          setSelectMedical(value);
                          return onChangeMedical({
                            target: { name: nameMedical, value },
                            type: 'text',
                          });
                        }}
                      >
                        <MultiSelectOption
                          style={{ direction: 'rtl' }}
                          value="wife"
                        >
                          الزوجة
                        </MultiSelectOption>
                        <MultiSelectOption
                          style={{ direction: 'rtl' }}
                          value="children"
                        >
                          الابناء
                        </MultiSelectOption>
                      </MultiSelect>
                      <FieldError />
                      <FieldHint />
                    </Field>
                  </Box>
                )}

                {medical && selectMedical.includes('children') && (
                  <Box padding={5} background="neutral0">
                    <Divider style={{ margin: '10px 0' }} />
                    <Field
                      style={{ width: '300px' }}
                      error={errorsStepTwo?.children?.message}
                    >
                      <Flex direction="column" alignItems="stretch" gap={1}>
                        <FieldInput
                          placeholder="عدد الابناء (يمكنك التجديد لاثنين فقط) "
                          type="number"
                          min={1}
                          max={2}
                          {...registerStepTwo('children', {
                            required: 'برجاء ادخال ارقام',
                            max: {
                              value: 2,
                              message: 'برجاء التأكد من العدد الذى أدخلته',
                            },

                            min: {
                              value: 1,
                              message: 'برجاء التأكد من العدد الذى أدخلته',
                            },
                          })}
                          variant="epsilon"
                        />
                        <FieldError />
                        <FieldHint />
                      </Flex>
                    </Field>
                    <UploadFile
                      fieldData={{
                        id: 'childrenAttachments',
                        label: 'المرفقات(شهادات ميلاد الاولاد)',
                      }}
                      register={registerStepTwo}
                      multiple={true}
                      errors={errorsStepTwo}
                      setValue={setValueStepTwo}
                      accept="image/png, image/jpeg, application/pdf"
                      clearErrors={clearErrorsStepTwo}
                      setError={setErrorStepTwo}
                    />
                    {childrenFiles?.map((file) => (
                      <div>{file.name}</div>
                    ))}
                  </Box>
                )}
                {medical && selectMedical.includes('wife') && (
                  <Box padding={5} background="neutral0">
                    <Divider style={{ margin: '10px 0' }} />
                    <Field style={{ width: '300px' }}>
                      <Flex direction="column" alignItems="stretch" gap={1}>
                        <UploadFile
                          fieldData={{
                            id: 'nationalIDFront',
                            label: 'صورة بطاقة الزوجه امامي',
                          }}
                          register={registerStepTwo}
                          errors={errorsStepTwo}
                          setValue={setValueStepTwo}
                          accept="image/png, image/jpeg, application/pdf"
                          clearErrors={clearErrorsStepTwo}
                          setError={setErrorStepTwo}
                        />
                        <UploadFile
                          fieldData={{
                            id: 'nationalIDBack',
                            label: 'صورة بطاقة الزوجة خلفي',
                          }}
                          register={registerStepTwo}
                          errors={errorsStepTwo}
                          setValue={setValueStepTwo}
                          accept="image/png, image/jpeg, application/pdf"
                          clearErrors={clearErrorsStepTwo}
                          setError={setErrorStepTwo}
                        />
                        <UploadFile
                          fieldData={{
                            id: 'wifeAttachments',
                            label: 'المرفقات(شهادة تأمينات أن الزوجة لا تعمل)',
                          }}
                          multiple={true}
                          register={registerStepTwo}
                          errors={errorsStepTwo}
                          setValue={setValueStepTwo}
                          accept="image/png, image/jpeg, application/pdf"
                          clearErrors={clearErrorsStepTwo}
                          setError={setErrorStepTwo}
                        />
                      </Flex>
                    </Field>
                  </Box>
                )}

                <Box
                  padding={5}
                  background="neutral0"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: '100px',
                  }}
                >
                  <Button endIcon={<ChevronLeft />} type="submit">
                    تقديم الطلب
                  </Button>
                </Box>
              </div>
            )}
          </form>
        </ContentLayout>
      </Layout>
    </div>
  );
}
