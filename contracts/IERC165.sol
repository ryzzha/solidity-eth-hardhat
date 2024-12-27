// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title IERC165 - Інтерфейс стандарту ERC165
/// @notice ERC165 визначає стандартний спосіб перевірки підтримки інтерфейсів контрактом.
interface IERC165 {
    /// @notice Повертає `true`, якщо контракт підтримує інтерфейс, визначений `interfaceId`.
    /// @param interfaceId Унікальний ідентифікатор інтерфейсу (обчислений через `bytes4`).
    /// @return `true` якщо контракт підтримує інтерфейс, інакше `false`.
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}