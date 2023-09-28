'use client';

import * as React from 'react';
import { cn } from '@/util/cn';
import { MD } from '@/util/constants';
import { useViewportSize } from '@mantine/hooks';

const MorePostsSubtitle = ({ content, subtitle }: { content: string; subtitle: string }) => {
  const { height, width } = useViewportSize();

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const paragraphs = doc.querySelectorAll('p');

  let firstNonEmptyParagraph = null;
  for (let p of paragraphs) {
    if (p.innerHTML.trim() !== '<br>') {
      firstNonEmptyParagraph = p;
      break;
    }
  }

  return (
    <>
      <p className={cn(`two-line-ellipsis text-muted`, { 'enable-ellipsis': width < MD })}>
        {firstNonEmptyParagraph?.innerHTML}
      </p>
    </>
  );
};

export default MorePostsSubtitle;
