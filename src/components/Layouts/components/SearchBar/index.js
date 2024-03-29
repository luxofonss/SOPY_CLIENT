/* eslint-disable no-undef */
import { Combobox, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Fragment, useState } from 'react'
import { useLocation } from 'react-router'
import { useSearchParams } from 'react-router-dom'

export default function SearchBar() {
  const [selected, setSelected] = useState('')
  const [query, setQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  let queryParams = new URLSearchParams(location.search)
  if (queryParams.has('keyword')) {
    queryParams.delete('keyword')
  }

  console.log('searchParams;; ', searchParams.get('typeId'))

  const handleSearch = () => {
    if (query !== '') {
      setSearchParams({ typeId: searchParams.get('typeId'), keyword: query })
      let items = localStorage.getItem('searchTextStorages')
        ? JSON.parse(localStorage.getItem('searchTextStorages'))
        : []
      // Add the new item to the array
      if (items.indexOf(query) !== -1) {
        items.splice(items.indexOf(query), 1)
      }
      items.unshift(query)
      if (items.length > 10) {
        items = items.splice(0, 10)
      }
      // Store the updated array in localStorage
      localStorage.setItem('searchTextStorages', JSON.stringify(items))
      setSelected(query)
    }
  }
  //...
  const searchTextStorage = JSON.parse(localStorage.getItem('searchTextStorages'))

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      // "Enter" key
      setSelected(event.target.value)
      handleSearch()
      // Perform desired action
    }
  }
  const filteredSearch =
    query === ''
      ? searchTextStorage
      : searchTextStorage?.filter((person) =>
          person.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <div className='w-full'>
      <Combobox value={selected} onChange={setSelected}>
        <div className='relative mt-1'>
          <div className='relative w-full cursor-default overflow-hidden rounded-xl border-[1px] border-neutral-300 bg-neutral-200 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm'>
            <Combobox.Input
              className='w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 outline-none focus:ring-0'
              displayValue={(person) => person}
              onKeyDown={handleKeyDown}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button onClick={handleSearch} className='absolute inset-y-0 right-2 flex items-center pr-2'>
              <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {filteredSearch?.length === 0 && query !== '' ? (
                <div className='relative cursor-default select-none py-2 px-4 text-gray-700'>Tìm kiếm sản phẩm</div>
              ) : (
                filteredSearch?.map((keyword) => (
                  <Combobox.Option
                    key={keyword}
                    className={({ active }) =>
                      `relative cursor-default select-none py-1 pl-10 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={keyword}
                    onClick={handleSearch}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{keyword}</span>
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}
