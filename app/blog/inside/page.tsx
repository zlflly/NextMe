import TypeSwitch from '../type-switch'
import InsideList from './inside-list'

export const metadata = {
  title: 'Inside',
  description: 'Some inner thoughts.',
}

export default async function InsidePage() {
  return (
    <section className="sm:px-14 sm:pt-6">
      <h1 className="mb-2 text-2xl font-medium tracking-tighter">Inside</h1>
      <p className="prose prose-neutral mb-2 text-sm dark:prose-invert">
        一些内心独白。
      </p>
      <TypeSwitch />
      <InsideList />
    </section>
  )
}
