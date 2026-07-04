import { useTranslations } from 'next-intl'

export default function HowItWorks() {
  const t = useTranslations('how')

  const steps = [
    { num: 1, title: t('step1title'), desc: t('step1desc') },
    { num: 2, title: t('step2title'), desc: t('step2desc') },
    { num: 3, title: t('step3title'), desc: t('step3desc') },
  ]

  return (
    <section className="bg-sand py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-night mb-2">{t('title')}</h2>
        <p className="text-stone-500 mb-10">{t('subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-terra text-white flex items-center justify-center text-xl font-bold mb-4">
                {step.num}
              </div>
              <h3 className="font-bold text-night mb-2">{step.title}</h3>
              <p className="text-stone-500 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
