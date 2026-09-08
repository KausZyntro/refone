export type QuestionOption = {
  label: string;
  value: string;
  isNegative?: boolean; // Used to style negative options differently if needed
};

export type Question = {
  id: number;
  text: string;
  options: QuestionOption[];
  subtext?: string;
  infoMessage?: string;
};

export type QuestionCategory = {
  id: string;
  title: string;
  subtitle: string;
  icon?: string; // Using a string to represent icon name or SVG path later
  questions: Question[];
};

export type StepSchema = {
  step: number;
  title: string;
  subtitle: string;
  categories: QuestionCategory[];
};

export const exchangeQuestionsSchema: StepSchema[] = [
  {
    step: 1,
    title: 'Device Condition',
    subtitle: 'Answer a few questions',
    categories: [
      {
        id: 'power_functionality',
        title: '1. Device Power & Functionality',
        subtitle: 'Let us know about your iPhone\'s basic functions.',
        questions: [
          {
            id: 1,
            text: 'Does the iPhone switch on properly?',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' }
            ]
          },
          {
            id: 2,
            text: 'Does the iPhone stay switched on without randomly restarting or shutting down?',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' }
            ]
          },
          {
            id: 3,
            text: 'Does the iPhone charge properly?',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' }
            ]
          },
          {
            id: 4,
            text: 'Does the charging port work properly?',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' }
            ]
          },
          {
            id: 5,
            text: 'Does the iPhone charge using a wireless/MagSafe charger? (if supported by model)',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
              { label: 'Not tested', value: 'not_tested' }
            ]
          }
        ]
      },
      {
        id: 'display_touch',
        title: '2. Display & Touch',
        subtitle: 'Tell us about your iPhone\'s display and touch performance.',
        questions: [
          {
            id: 6,
            text: 'Is the display working properly?',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' }
            ]
          },
          {
            id: 7,
            text: 'Does the touchscreen work properly across the entire screen?',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' }
            ]
          },
          {
            id: 8,
            text: 'Does the screen have any cracks or broken glass?',
            options: [
              { label: 'No', value: 'no' },
              { label: 'Minor crack', value: 'minor' },
              { label: 'Major crack', value: 'major' },
              { label: 'Completely broken', value: 'completely_broken' }
            ]
          },
          {
            id: 9,
            text: 'Are there any black spots, lines, flickering, dead pixels, or display discoloration?',
            options: [
              { label: 'No', value: 'no' },
              { label: 'Yes', value: 'yes' }
            ]
          },
          {
            id: 10,
            text: 'Does the display have any burn-in or ghost image?',
            options: [
              { label: 'No', value: 'no' },
              { label: 'Yes', value: 'yes' }
            ]
          },
          {
            id: 11,
            text: 'Is the display original and properly fitted?',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
              { label: 'Don\'t know', value: 'dont_know' }
            ]
          }
        ]
      }
    ]
  },
  {
    step: 2,
    title: 'Body Condition',
    subtitle: 'Screen & Body',
    categories: [
      {
        id: 'body_physical_1',
        title: '3. Body / Physical Condition',
        subtitle: 'Let\'s check the body of your device.',
        questions: [
          {
            id: 12,
            text: 'Does the body/frame have any major dents?',
            options: [
              { label: 'No', value: 'no' },
              { label: 'Minor dents', value: 'minor' },
              { label: 'Major dents', value: 'major' }
            ]
          },
          {
            id: 13,
            text: 'Are there deep scratches on the body?',
            options: [
              { label: 'No', value: 'no' },
              { label: 'Minor scratches', value: 'minor' },
              { label: 'Deep scratches', value: 'deep' }
            ]
          },
          {
            id: 14,
            text: 'Is the back glass intact?',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'Cracked', value: 'cracked' },
              { label: 'Broken', value: 'broken' }
            ]
          },
          {
            id: 15,
            text: 'Is the camera glass intact?',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'Cracked', value: 'cracked' },
              { label: 'Broken', value: 'broken' }
            ]
          }
        ]
      },
      {
        id: 'body_physical_12',
        title: '4. Body Condition Continued',
        subtitle: '',
        questions: [
          {
            id: 16,
            text: 'Are there any signs of the phone being bent or twisted?',
            options: [
              { label: 'No', value: 'no' },
              { label: 'Yes', value: 'yes' }
            ]
          },
          {
            id: 17,
            text: 'Are any buttons physically damaged or missing?',
            options: [
              { label: 'No', value: 'no' },
              { label: 'Yes', value: 'yes' }
            ]
          },
          {
            id: 18,
            text: 'Is the SIM tray intact and functional?',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' }
            ]
          }
        ]
      }
    ]
  },
  {
  step: 3,
  title: 'Camera & Audio',
  subtitle: 'Lenses & Sound',
  categories: [
    {
      id: 'cameras',
      title: '5. Cameras',
      subtitle: 'Check the camera functionality of your iPhone.',
      questions: [
        {
          id: 23,
          text: 'Does the rear camera work properly?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        },
        {
          id: 24,
          text: 'Does the front camera work properly?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        },
        {
          id: 25,
          text: 'Do all rear camera lenses work properly?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
            { label: 'Not applicable', value: 'not_applicable' }
          ]
        },
        {
          id: 26,
          text: 'Does autofocus work properly?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        },
        {
          id: 27,
          text: 'Is there any crack, fog, dust, or damage inside the camera lens?',
          options: [
            { label: 'No', value: 'no' },
            { label: 'Yes', value: 'yes' }
          ]
        },
        {
          id: 28,
          text: 'Does Portrait mode work properly?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
            { label: 'Not applicable', value: 'not_applicable' }
          ]
        }
      ]
    },
    {
      id: 'audio_microphone',
      title: '6. Audio & Microphone',
      subtitle: 'Check the speakers and microphone of your iPhone.',
      questions: [
        {
          id: 29,
          text: 'Does the earpiece speaker work properly during calls?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        },
        {
          id: 30,
          text: 'Does the loudspeaker work properly?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        },
        {
          id: 31,
          text: 'Does the microphone work properly?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        },
        {
          id: 32,
          text: 'Does the phone record audio clearly?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        }
      ]
    }
  ]
},
  {
  step: 4,
  title: 'Connectivity',
  subtitle: 'Network & Sensors',
  categories: [
    {
      id: 'connectivity',
      title: '7. Connectivity',
      subtitle: 'Check the connectivity features of your iPhone.',
      questions: [
        {
          id: 33,
          text: 'Can the iPhone connect to a mobile network properly?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        },
        {
          id: 34,
          text: 'Does Wi-Fi work properly?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        },
        {
          id: 35,
          text: 'Does Bluetooth work properly?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        },
        {
          id: 36,
          text: 'Does GPS/location work properly?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        },
        {
          id: 37,
          text: 'Does NFC work properly?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
            { label: 'Not tested', value: 'not_tested' }
          ]
        },
        {
          id: 38,
          text: 'Does 4G/5G work properly?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
            { label: 'Not applicable', value: 'not_applicable' }
          ]
        }
      ]
    },
    {
      id: 'face_touch_id',
      title: '8. Face ID / Touch ID',
      subtitle: 'Check the biometric authentication features of your iPhone.',
      questions: [
        {
          id: 39,
          text: 'Does Face ID work properly?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
            { label: 'Not applicable', value: 'not_applicable' }
          ]
        },
        {
          id: 40,
          text: 'Is Face ID disabled because of a hardware issue?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
            { label: "Don't know", value: 'dont_know' }
          ],
          infoMessage: 'For older iPhones:'
        },
        {
          id: 41,
          text: 'Does Touch ID work properly?',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
            { label: 'Not applicable', value: 'not_applicable' }
          ]
        }
      ]
    }
  ]
}
];
