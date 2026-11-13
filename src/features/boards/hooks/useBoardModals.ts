import { useState } from 'react';
import { Id } from '../../../common/interfaces/common';
import { CreateListDto } from '../../lists/types/ListDtos';
import { CreateCardDto } from '../../cards/types/CardDtos';
import { BoardModalsProps } from '../components/BoardModals/BoardModals';

export interface BoardModalActions {
  createList: (dto: CreateListDto) => Promise<void>;
  deleteBoard: () => Promise<void>;
  deleteList: (id: Id) => Promise<void>;
  createCard: (dto: CreateCardDto) => Promise<void>;
  deleteCard: (id: Id) => Promise<void>;
}

export interface UseBoardModalsReturn {
  openCreateListModal: () => void;
  openCreateCardModal: (listId: Id) => void;
  openDeleteBoardModal: () => void;
  setListIdToDelete: (id: Id) => void;
  setCardIdToDelete: (id: Id) => void;
  isBoardDeleting: boolean;
  isListDeleting: boolean;
  isCardDeleting: boolean;
  modalProps: BoardModalsProps;
}

export function useBoardModals(board: BoardModalActions): UseBoardModalsReturn {
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [newCardListId, setNewCardListId] = useState<Id | null>(null);

  const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);
  const [listIdToDelete, setListIdToDelete] = useState<Id>(Number.NaN);
  const [cardIdToDelete, setCardIdToDelete] = useState<Id>(Number.NaN);

  const [isBoardDeleting, setIsBoardDeleting] = useState(false);
  const [isListDeleting, setIsListDeleting] = useState(false);
  const [isCardDeleting, setIsCardDeleting] = useState(false);

  const handleDeleteBoard = async (): Promise<void> => {
    setIsBoardDeleting(true);
    try {
      await board.deleteBoard();
    } finally {
      setIsBoardDeleting(false);
    }
  };

  const handleDeleteList = async (): Promise<void> => {
    setIsListDeleting(true);
    try {
      await board.deleteList(listIdToDelete);
    } finally {
      setIsListDeleting(false);
    }
  };

  const handleDeleteCard = async (): Promise<void> => {
    setIsCardDeleting(true);
    try {
      await board.deleteCard(cardIdToDelete);
    } finally {
      setIsCardDeleting(false);
    }
  };

  const handleCreateList = async (data: CreateListDto): Promise<void> => {
    await board.createList(data);
  };

  const handleCreateCard = async (data: CreateCardDto): Promise<void> => {
    if (newCardListId === null) return;
    await board.createCard({ ...data, list_id: newCardListId });
  };

  return {
    openCreateListModal: (): void => setIsCreateListModalOpen(true),
    openCreateCardModal: (listId: Id): void => setNewCardListId(listId),
    openDeleteBoardModal: (): void => setIsDeleteBoardModalOpen(true),
    setListIdToDelete,
    setCardIdToDelete,
    isBoardDeleting,
    isListDeleting,
    isCardDeleting,
    modalProps: {
      isCreateListOpen: isCreateListModalOpen,
      onCloseCreateList: (): void => setIsCreateListModalOpen(false),
      onCreateList: handleCreateList,
      isCreateCardOpen: newCardListId !== null,
      onCloseCreateCard: (): void => setNewCardListId(null),
      onCreateCard: handleCreateCard,
      isDeleteBoardOpen: isDeleteBoardModalOpen,
      onCloseDeleteBoard: (): void => setIsDeleteBoardModalOpen(false),
      onConfirmDeleteBoard: handleDeleteBoard,
      isDeleteBoardLoading: isBoardDeleting,
      isDeleteListOpen: !Number.isNaN(listIdToDelete),
      onCloseDeleteList: (): void => setListIdToDelete(Number.NaN),
      onConfirmDeleteList: handleDeleteList,
      isDeleteListLoading: isListDeleting,
      isDeleteCardOpen: !Number.isNaN(cardIdToDelete),
      onCloseDeleteCard: (): void => setCardIdToDelete(Number.NaN),
      onConfirmDeleteCard: handleDeleteCard,
      isDeleteCardLoading: isCardDeleting,
    },
  };
}
