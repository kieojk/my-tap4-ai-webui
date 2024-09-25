/* eslint-disable react/jsx-no-target-blank */

import Link from 'next/link';
import { WebNavigation } from '@/db/supabase/types';
import { CircleArrowRight, SquareArrowOutUpRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

import Image from 'next/image';

// export default function WebNavCard({ name, thumbnail_url, title, url, content, translations }: WebNavigation) {
export default function WebNavCard(props : WebNavigation) {
  const t = useTranslations('Home');
  const locale = useLocale();

  const { name } = props;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { thumbnail_url } = props;
  const { url } = props;
  const { translations } = props;

  // const title = locale !== 'en' && translations && translations[1][locale] ? translations[1][locale].title : props.title;
  // const content = locale !== 'en' && translations && translations[1][locale] ? translations[1][locale].content : props.content;
  const { title: defaultTitle, content: defaultContent } = props;
  const title = locale !== 'en' && translations && translations[1][locale] ? translations[1][locale].title : defaultTitle;
  const content = locale !== 'en' && translations && translations[1][locale] ? translations[1][locale].content : defaultContent;

  return (
    <div className='flex h-[210px] flex-col gap-3 rounded-xl bg-[#2C2D36] p-1 lg:h-[343px]'>
      <Link href={`/ai/${name}`} title={title} className='group relative'>
        <Image
          src={thumbnail_url || ''}
          alt={title}
          title={title}
          width={310}
          height={174}
          className='aspect-[310/174] w-full rounded-xl bg-white/40 hover:opacity-70'
        />
        <div className='absolute inset-0 z-10 hidden items-center justify-center gap-1 rounded-xl bg-black bg-opacity-50 text-xl text-white transition-all duration-200 group-hover:flex'>
          {t('checkDetail')} <CircleArrowRight className='size-4' />
        </div>
      </Link>
      <div className='flex items-center justify-between px-[6px]'>
        <a href={url} title={title} target='_blank' rel='nofollow' className='hover:opacity-70'>
          <h3 className='line-clamp-1 flex-1 text-sm font-bold lg:text-base'>{title}</h3>
        </a>
        <a href={url} title={title} target='_blank' rel='nofollow' className='hover:opacity-70'>
          <SquareArrowOutUpRight className='size-5' />
          <span className='sr-only'>{title}</span>
        </a>
      </div>
      <p className='line-clamp-3 px-[6px] text-xs text-white/70 lg:line-clamp-5 lg:text-sm'>{content}</p>
    </div>
  );
}
