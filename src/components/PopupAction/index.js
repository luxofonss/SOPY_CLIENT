import AppButton from '@src/components/AppButton'
import AppModal from '@src/components/Modal'

function PopupAction({ closeConfirmRef, isConfirming, handleConfirm, triggerName, heading }) {
  return (
    <AppModal
      closeRef={closeConfirmRef}
      Trigger={<AppButton className='h-8 px-2 py-1 text-sm font-medium'>{triggerName}</AppButton>}
    >
      <div className='w-[450px] rounded-lg bg-neutral-200 p-4'>
        <h4 className='text-base font-medium text-neutral-600'>{heading}</h4>
        <div className='mt-6 flex items-center justify-center gap-4'>
          <AppButton
            type='button'
            onClick={() => {
              closeConfirmRef.current.closeModal()
            }}
          >
            Hủy
          </AppButton>
          <AppButton
            type='button'
            isLoading={isConfirming}
            onClick={() => {
              handleConfirm()
            }}
          >
            Xác nhận
          </AppButton>
        </div>
      </div>
    </AppModal>
  )
}

export default PopupAction
