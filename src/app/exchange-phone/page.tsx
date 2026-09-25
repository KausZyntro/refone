import ExchangeForm from '@/components/common/ExchangeForm/ExchangeForm'
import React, { Suspense } from 'react'

const exchange = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ExchangeForm />
      </Suspense>
    </div>
  )
}

export default exchange