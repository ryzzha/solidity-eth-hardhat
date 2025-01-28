//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "./IERC721.sol";
// import "./IERC721Metadata.sol";
// import "./IERC721Receiver.sol";
// import "./Strings.sol";

// contract ERC721 is IERC721, IERC721Metadata {
//     using Strings for uint;

//     string private _name;
//     string private _symbol;

//     mapping(address => uint) _balances;
//     mapping(uint => address) _owners;
//     mapping(uint => address) _tokenApprovals;
//     mapping(address => mapping(address => bool)) _operatorApprovals;

//     modifier _requireMinted(uint tokenId) {
//         require(_exists(tokenId), "not minted!");
//         _;
//     }

//     constructor(string memory name_, string memory symbol_) {
//         _name = name_;
//         _symbol = symbol_;
//     }

//     function balanceOf(address owner) external view returns (uint256 balance) {
//         require(owner != address(0), "zero address");
//         return _balances[owner];
//     }

//     function ownerOf(uint256 tokenId) public view _requireMinted(tokenId) returns (address owner) {
//         return _owners[tokenId];
//     }

//     function approve(address to, uint tokenId) public {
//         address _owner = ownerOf(tokenId);
//         require(_owner == msg.sender || isApprovedForAll(_owner, msg.sender), "not an owner!");
//         require(to != _owner, "cannot approve to self");
//         _tokenApprovals[tokenId] = to;
//         emit Approval(_owner, to, tokenId);
//     }

//     function transferFrom(address from, address to, uint256 tokenId) external {
//         require(_isApprovedOrOwner(msg.sender, tokenId), "not approved or owner");

//         _transfer(from, to, tokenId);
//     }

//     function safeTransferFrom(address from, address to, uint256 tokenId) external {
//         require(_isApprovedOrOwner(msg.sender, tokenId), "not approved or owner");

//         _safeTransfer(from, to, tokenId, "");
//     }

//     function _safeTransfer(
//         address from,
//         address to,
//         uint tokenId,
//         bytes memory data
//     ) internal {
//         _transfer(from, to, tokenId);
//         require(_checkOnERC721Received(from, to, tokenId, data), "transfer to non-erc721 receiver");
//     }

//     function _checkOnERC721Received(
//         address from,
//         address to,
//         uint tokenId,
//         bytes memory data
//     ) private returns(bool) {
//         if(to.code.length > 0) {
//             try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) returns(bytes4 retval) {
//                 return retval == IERC721Receiver.onERC721Received.selector;
//             } catch(bytes memory reason) {
//                 if(reason.length == 0) {
//                     revert("Transfer to non-erc721 receiver");
//                 } else {
//                     assembly {
//                         revert(add(32, reason), mload(reason))
//                     }
//                 }
//             }
//         } else {
//             return true;
//         }
//     }

//     function _transfer(address from, address to, uint tokenId) internal {
//         require(ownerOf(tokenId) == from, "incorrect owner!");
//         require(to != address(0), "to address is zero!");

//         // _beforeTokenTransfer(from, to, tokenId);

//         _balances[from]--;
//         _balances[to]++;
//         _owners[tokenId] = to;

//         emit Transfer(from, to, tokenId);

//         // _afterTokenTransfer(from, to, tokenId);
//     } 

//     function _isApprovedOrOwner(address spender, uint tokenId) internal view _requireMinted(tokenId) returns(bool) {
//         return ownerOf(tokenId) == spender || getApproved(tokenId) == spender || isApprovedForAll(ownerOf(tokenId), spender);
//     }

//     function getApproved(uint256 tokenId) public view _requireMinted(tokenId) returns (address operator) {
//         return _tokenApprovals[tokenId];
//     }

//     function isApprovedForAll(address owner, address operator) public view returns (bool) {
//         return _operatorApprovals[owner][operator];
//     }

//      function _safeMint(address to, uint tokenId) internal virtual {
//         _safeMint(to, tokenId, "");
//     }
//     function _safeMint(address to, uint tokenId, bytes memory data) internal virtual {
//         _mint(to, tokenId);
//         require(_checkOnERC721Received(address(0), to, tokenId, data), "non-erc721 receiver");
//     }
//     function _mint(address to, uint tokenId) internal virtual {
//         require(to != address(0), "zero address to");
//         require(!_exists(tokenId), "this token id is already minted");
//         // _beforeTokenTransfer(address(0), to, tokenId);
//         _owners[tokenId] = to;
//         _balances[to]++;
//         emit Transfer(address(0), to, tokenId);
//         // _afterTokenTransfer(address(0), to, tokenId);
//     }
//     function burn(uint256 tokenId) public virtual {
//         require(_isApprovedOrOwner(msg.sender, tokenId), "not owner!");
//         _burn(tokenId);
//     }
//     function _burn(uint tokenId) internal virtual {
//         address owner = ownerOf(tokenId);
//         // _beforeTokenTransfer(owner, address(0), tokenId);
//         delete _tokenApprovals[tokenId];
//         _balances[owner]--;
//         delete _owners[tokenId];
//         emit Transfer(owner, address(0), tokenId);
//         // _afterTokenTransfer(owner, address(0), tokenId);
//     }

//     function _baseURI() internal pure virtual returns(string memory) {
//         return "";
//     }
//     function tokenURI(uint tokenId) public view virtual _requireMinted(tokenId) returns(string memory) {
//         string memory baseURI = _baseURI();
//         return bytes(baseURI).length > 0 ?
//             string(abi.encodePacked(baseURI, tokenId.toString())) :
//             "";
//     }

//     function _exists(uint tokenId) internal view returns(bool) {
//         return _owners[tokenId] != address(0);
//     }
// }