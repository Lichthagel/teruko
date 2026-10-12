import type { Component } from "solid-js";
import { createMutation, createQuery } from "@urql/solid";
import styles from "client-css/m/tag.module.scss";
import { TagEdit, UpdateTag } from "client-graphql/snippets";
import { Save } from "lucide-solid";
import { createEffect, createSignal, Match, Switch, untrack } from "solid-js";
import Button from "../common/Button";
import Checkbox from "../common/Checkbox";
import Input from "../common/Input";
import Select from "../common/Select";
import SkeletonLoader from "../common/SkeletonLoader";

export type TagEditSectionProps = {
  slug: string;
  afterUpdate?: (newSlug?: string) => void;
};

const TagEditSection: Component<TagEditSectionProps> = (props) => {
  const [slugInputValue, setSlugInputValue] = createSignal("");
  const [categoryInputValue, setCategoryInputValue] = createSignal<string>();
  const [approvedInputValue, setApprovedInputValue] = createSignal<boolean>();

  createEffect(() => {
    setSlugInputValue(props.slug);
  });

  const [result] = createQuery({
    query: TagEdit,
    variables: () => ({ slug: props.slug }),
  });

  createEffect(() => {
    setCategoryInputValue(result.data?.tag?.category?.slug);
    setApprovedInputValue(result.data?.tag?.approved);
  });

  const [resultUpdateTag, updateTag_] = createMutation(UpdateTag);
  const updateTag = () => updateTag_({
    slug: props.slug,
    newSlug: slugInputValue(),
    category: categoryInputValue(),
    approved: approvedInputValue(),
  }).then((res) => {
    const afterUpdate = untrack(() => props.afterUpdate);
    if (afterUpdate && res.data?.updateTag) {
      afterUpdate(res.data.updateTag.slug);
    }
  });

  return (
    <>
      <h1>Meta</h1>
      <Switch>
        <Match when={result.fetching}>
          <SkeletonLoader />
        </Match>
        <Match when={result.data}>
          {data => (
            <div class={styles.content}>
              <div class={styles.row}>
                <Input value={slugInputValue()} setValue={setSlugInputValue} />
                <Select
                  options={data().tagCategories.map(v => v.slug) ?? []}
                  value={categoryInputValue()}
                  setValue={setCategoryInputValue}
                />
              </div>
              <div class={styles.row}>
                <Checkbox checked={approvedInputValue() ?? false} setChecked={setApprovedInputValue} label="approved" />
                <Button
                  style={{ "flex-grow": 0 }}
                  icon={Save}
                  disabled={resultUpdateTag?.fetching}
                  onClick={(e) => {
                    e.preventDefault();
                    updateTag();
                  }}
                />
              </div>
            </div>
          )}
        </Match>
      </Switch>
    </>
  );
};

export default TagEditSection;
