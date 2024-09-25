import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/db/supabase/client';
import { CircleArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Separator } from '@/components/ui/separator';
import BaseImage from '@/components/image/BaseImage';
import MarkdownProse from '@/components/MarkdownProse';

import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import { useTranslations} from 'next-intl';

export const getStaticPaths: GetStaticPaths = async ({locales}) => {
  const supabase = createClient();
  const { data } = await supabase.from('web_navigation').select('name');
  
  const paths = data?.flatMap((item) => 
    locales?.map((locale) => ({
      params: { websiteName: item.name, locale },
    })) || []
  ) || [];

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const supabase = createClient();
  const websiteName = params?.websiteName as string;

  const { data } = await supabase
    .from('web_navigation')
    .select()
    .eq('name', websiteName)
    .single();

  if (!data) {
    return { notFound: true };
  }

  const localizedData = locale && locale !== 'en' && data.translations && typeof data.translations === 'object' && data.translations[1] && typeof data.translations[1][locale] === 'object'
    ? { ...data, ...data.translations[1][locale] }
    : data;

  return {
    props: {
      data: localizedData,
      messages: (await import(`@/messages/${locale}.json`)).default,
    },
    revalidate: 3600, // Revalidate every hour
  };
};

export async function generateMetadata({
  params: { locale, websiteName },
}: {
  params: { locale: string; websiteName: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase.from('web_navigation').select().eq('name', websiteName).single();

  if (!data) {
    return {};
  }

  const localizedData = locale !== 'en' && data.translations && data.translations[1][locale]
    ? { ...data, ...data.translations[1][locale] }
    : data;

  return {
    title: `${localizedData.title} | AI Tool Directory`,
    description: localizedData.content,
  };
}


export default function Page({ data }: { data: any }) {
  const t = useTranslations('Startup.detail');
  // 添加数据加载检查
  // if (!data) {
  //   return <div>加载中...</div>; // 或者返回一个更精致的加载组件
  // }

  return (
    <div className='w-full'>
      <div className='flex flex-col px-6 py-5 lg:h-[323px] lg:flex-row lg:justify-between lg:px-0 lg:py-10'>
        <div className='flex flex-col items-center lg:items-start'>
          <div className='space-y-1 text-balance lg:space-y-3'>
            <h1 className='text-2xl lg:text-5xl'>{data.title || '无标题'}</h1>
            <h2 className='text-xs lg:text-sm'>{data.content || '暂无内容'}</h2>
          </div>
          <a
            href={data.url}
            target='_blank'
            rel='noreferrer'
            className='flex-center mt-5 min-h-5 w-full gap-1 rounded-[8px] bg-white p-[10px] text-sm capitalize text-black hover:opacity-80 lg:mt-auto lg:w-[288px]'
          >
            {t('visitWebsite')} <CircleArrowRight className='size-[14px]' />
          </a>
        </div>
        <a
          href={data.url}
          target='_blank'
          rel='noreferrer'
          className='flex-center group relative h-[171px] w-full flex-shrink-0 lg:h-[234px] lg:w-[466px]'
        >
          <Image
            title={data.title || ''}
            alt={data.title || ''}
            // width={466}
            // height={243}
            fill
            src={data.thumbnail_url || ''}
            className='absolute mt-3 aspect-[466/234] w-full rounded-[16px] border border-[#424242] bg-[#424242] bg-cover lg:mt-0'
          />
          <div className='absolute inset-0 z-10 hidden items-center justify-center gap-1 rounded-[16px] bg-black bg-opacity-50 text-2xl text-white transition-all duration-200 group-hover:flex'>
            {t('visitWebsite')} <CircleArrowRight className='size-5' />
          </div>
        </a>
      </div>
      <Separator className='bg-[#010101]' />
      <div className='mb-5 px-3 lg:px-0'>
        <h2 className='my-5 text-2xl text-white/40 lg:my-10'>{t('introduction')}</h2>
        <MarkdownProse markdown={data?.detail || ''} />
      </div>
    </div>
  );
}