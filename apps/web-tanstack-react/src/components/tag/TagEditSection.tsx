import type { FunctionComponent } from "react";
import styles from "client-css/m/tag.module.scss";
import { TagEdit, UpdateTag } from "client-graphql/snippets";
import { Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import SkeletonLoader from "../common/SkeletonLoader";

export type TagEditSectionProps = {
  slug: string;
  afterUpdate?: (newSlug?: string) => void;
};

const TagEditSection: FunctionComponent<TagEditSectionProps> = ({ slug, afterUpdate }) => {
  const [slugInputValue, setSlugInputValue] = useState(slug);
  const [categoryInputValue, setCategoryInputValue] = useState<string>();

  const [result] = useQuery({
    query: TagEdit,
    variables: { slug },
  });

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    setCategoryInputValue(result.data?.tag?.category?.slug);
  }, [result.data?.tag?.category?.slug]);

  const [resultUpdateTag, updateTag_] = useMutation(UpdateTag);
  const updateTag = useCallback(() => {
    updateTag_({ slug, newSlug: slugInputValue, category: categoryInputValue });
  }, [categoryInputValue, slug, slugInputValue, updateTag_]);

  useEffect(() => {
    if (afterUpdate && resultUpdateTag.data?.updateTag) {
      afterUpdate(resultUpdateTag.data.updateTag.slug);
    }
  // eslint-disable-next-line react/exhaustive-deps
  }, [resultUpdateTag.data?.updateTag]);

  return (
    <>
      <h1>Meta</h1>
      {result.fetching
        ? <SkeletonLoader />
        : (
            <div className={styles.row}>
              <Input value={slugInputValue} setValue={setSlugInputValue} />
              <Select
                options={result.data?.tagCategories.map(v => v.slug) ?? []}
                value={categoryInputValue}
                setValue={setCategoryInputValue}
              />
              <Button
                style={{ flexGrow: 0 }}
                icon={Save}
                disabled={resultUpdateTag?.fetching}
                onClick={(e) => {
                  e.preventDefault();
                  updateTag();
                }}
              />
            </div>
          )}
    </>
  );
};

export default TagEditSection;
