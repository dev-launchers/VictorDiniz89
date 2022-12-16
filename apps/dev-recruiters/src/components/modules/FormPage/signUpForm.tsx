import React, { useEffect } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useUserDataContext } from '../../../contexts/UserDataContext';
import { NewApplicant } from '@devlaunchers/models/newApplicant';
import { SkillLevel } from '@devlaunchers/models/level';
import { atoms, organisms } from '@devlaunchers/components/src/components';
import { agent } from '@devlaunchers/utility';
interface FormFields extends Omit<NewApplicant, 'level'> {
  level: NewApplicant['level'] | '';
}

export default function SignUpForm() {
  const SignupSchema = Yup.object().shape({
    name: Yup.string().required('Name Field Entry is Required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email Field Entry is Required'),
    portfolioLink: Yup.string().matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Invalid url'
    ),
    commitment: Yup.number()
      .moreThan(0, 'Commitment Field Entry is Required')
      .required('Commitment Field Entry is Required'),
    experience: Yup.string().required('Experience Field Entry is Required'),
    accepted: Yup.boolean().required('Acceptance Field Entry is Required'),
  });

  const router = useRouter();
  // const { userData } = useUserDataContext();

  // ! GOING TO BE ACTIVATED AGAIN ONCE WE HAVE BACKEND REDIRECTION
  // useEffect(() => {
  //   if (userData.id == 0) {
  //     router.push("/login");
  //   }
  // }, [router, userData.id]);

  return (
    <Formik
      initialValues={{
        discordUsername: '',
        name: '',
        email: '',
        age: 0,
        level: 'Intermediate',
        accepted: false,
        commitment: 0,
        extraInfo: '',
        portfolioLink: '',
        experience: '',
        reason: '',
        zip: 0,
        role: router.query.position as string,
        id: router.query.slug as string,
        project: router.query.slug as string,
        skills: [{ skill: '' }],
      }}
      onSubmit={(
        values: NewApplicant,
        { setSubmitting }: FormikHelpers<NewApplicant>
      ) => {
        setSubmitting(true);
        console.log(values);

        agent.Applicant.post({
          ...values,
          //@ts-ignore
          level: values.level.toLowerCase(),
          skills: values.skills
            .toString()
            .split(',')
            .map((skill) => ({ skill: skill })),
          role: router.query.position as string,
          project: router.query.project as string,
          id: router.query.slug as string,
        })
          .then((res) => {
            setSubmitting(false);
            router.push('/join/confirmation');
          })
          .catch((error) => {
            setSubmitting(false);
            console.log(error);
            console.log(error.response);
            console.log(error.response.data);
            console.log(error.response.status);
          });
      }}
      validationSchema={SignupSchema}
    >
      {({ errors, setFieldValue, touched }) => (
        <Form
          css={{
            padding: '2rem',
            boxShadow: '0px 10px 18px 10px rgba(127, 126, 127, 0.25)',
            borderRadius: 32,
            maxWidth: '1536px',
            margin: '2rem auto',
          }}
        >
          <atoms.Box flexDirection="column" maxWidth="90%" margin="auto">
            <atoms.Box flexDirection="column">
              <atoms.Layer hasRainbow>
                <atoms.Typography type="h2" css={{ textAlign: 'center' }}>
                  Volunteer Application
                </atoms.Typography>
              </atoms.Layer>
            </atoms.Box>
            <atoms.Box
              flexDirection="column"
              gap="32px"
              paddingBlock="2rem"
              css={{ maxWidth: 'fit-content' }}
            >
              <Field
                as={organisms.FormField}
                label="Your Full Name"
                placeholder="John Smith"
                id="name"
                name="name"
                required
                // onChange={handleChange}
                error={errors.name}
              />
              <Field
                as={organisms.FormField}
                label="Your Email"
                placeholder="johnsmith@gmail.com"
                id="email"
                name="email"
                required
                touched={touched['email']}
                error={errors.email}
              />
              <Field
                as={organisms.FormField}
                label="Your Discord Username"
                placeholder="johnsmith#1234"
                id="discordUsername"
                name="discordUsername"
              />
              <atoms.Box gap="32px" flexDirection="column">
                <Field
                  as={organisms.FormField}
                  label={
                    <atoms.Box gap="1rem" alignItems="center">
                      What are your relevant skills?
                      <atoms.ToolTip
                        content="Please Separate skills with a coma."
                        direction="left"
                        delay={100}
                      >
                        ℹ️
                      </atoms.ToolTip>
                    </atoms.Box>
                  }
                  placeholder="Please separate skills with comma"
                  id="skills"
                  name="skills"
                />
              </atoms.Box>
              <atoms.Box flexDirection="column">
                <atoms.Typography type="pSmall">
                  HOW MANY HOURS A WEEK WOULD YOU LIKE TO VOLUNTEER?
                </atoms.Typography>

                <atoms.Slider
                  min={0}
                  max={10}
                  onChange={(value) => setFieldValue('commitment', +value)}
                  withLabels
                  suffix=" hrs"
                />
                <atoms.Typography type="pSmall" css={{ color: 'red' }}>
                  {errors.commitment}
                </atoms.Typography>
              </atoms.Box>
              <Field
                as={organisms.OpenResponse}
                cols={50}
                touched={touched['experience']}
                error={errors.experience}
                label="Please breifly describe your experience in development or design"
                placeholder="My experience with development / design is..."
                required
                rows={5}
                id="experience"
                name="experience"
                // onChange={handleChange}
              />
              <Field
                as={organisms.OpenResponse}
                cols={50}
                label="Why would you like to be a Dev Launcher?"
                placeholder="My experience with development / design is..."
                rows={5}
                id="reason"
                name="reason"
                // onChange={handleChange}
              />
              <Field
                as={organisms.FormField}
                label="Portfolio Link"
                placeholder="https://myportfolio.com"
                id="portfolioLink"
                name="portfolioLink"
                // onChange={handleChange}
                touched={touched.portfolioLink}
                error={errors.portfolioLink}
              />
              <atoms.Typography type="p">
                We require users to be 18 years old or older. Please confirm
                below.
              </atoms.Typography>
              <atoms.Checkbox
                label="I am 18 years old or older."
                disabled={false}
                required
              />
              <atoms.Checkbox
                label="I have read and agree to the Terms and Conditions."
                disabled={false}
                required
              />
              <atoms.Box maxWidth="50%">
                <atoms.Button
                  buttonSize="standard"
                  buttonType="primary"
                  type="submit"
                >
                  Submit
                </atoms.Button>
              </atoms.Box>
            </atoms.Box>
          </atoms.Box>
        </Form>
      )}
    </Formik>
  );
}
