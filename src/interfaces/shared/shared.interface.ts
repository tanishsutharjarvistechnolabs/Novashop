export interface Banner {
  title: string;
  imageSrc: string;
  imageAlt: string;
}

export interface SectionIntro {
  eyebrow: string;
  title: string;
  description: string;
}

export interface SectionIntroWithImage extends SectionIntro {
  imageSrc: string;
  imageAlt: string;
}

export interface SupportItem {
  id: string;
  number: string;
  iconClassName: string;
  titleLines: [string, string];
  description: string;
}

export interface SupportSectionData extends SectionIntro {
  items: SupportItem[];
}

export interface PaginationQuery {
  page: number;
  pageSize: number;
}
