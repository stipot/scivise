import React, { useEffect, useState } from 'react'
import {
	Input,
    Button,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import './CollectionsPage.css'
import { getObjectStoresInfo } from '../db'
import CollectionCard from '../components/CollectionCard'

function CollectionsPage() {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState
      } = useForm()
    const [collections, setCollections] = useState(null)

    function createCollection(data) {

        console.log(data.name);
        reset()
    } 

    useEffect(() => {
        getObjectStoresInfo().then((info) => setCollections(info))
        
    }, [])

    return (
        <div className='collections_page'>
            <form className='create_collection_form' 
                onSubmit={handleSubmit(createCollection)}
            >
                <Input placeholder='Название подборки' {...register('name')} />
                <Button variant='contained' type='submit'>Создать</Button>
            </form>
            {collections != null &&
                <div className="collections_list">
                    {collections.map((collection) => (
                        <CollectionCard name={collection.name} articlesCount={collection.articlesCount}/>
                    ))}
                </div>
            }
        </div>
    )
}

export default CollectionsPage