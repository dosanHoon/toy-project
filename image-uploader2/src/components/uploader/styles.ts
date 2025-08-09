import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 0 16px;
`;

export const DropArea = styled.div`
  border: 2px dashed #9aa0a6;
  background: #fafafa;
  padding: 32px;
  border-radius: 12px;
  text-align: center;
  color: #3c4043;
  p {
    margin: 0 0 16px;
  }
`;

export const Buttons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  button {
    background: #1a73e8;
    color: #fff;
    border: 0;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
  }
  button[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const Grid = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 160px);
  gap: 12px;
  justify-content: start;
  width: 332px;
`;

export const Toast = styled.div<{ $open: boolean }>`
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%)
    translateY(${({ $open }) => ($open ? "0" : "20px")});
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: all 250ms ease;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 10px 14px;
  border-radius: 8px;
  pointer-events: none;
  font-size: 14px;
`;

export const Tile = styled.div<{ $primary: boolean }>`
  position: relative;
  border: 2px solid ${({ $primary }) => ($primary ? "#1a73e8" : "transparent")};
  border-radius: 10px;
  overflow: hidden;
  background: #f0f0f0;
  min-height: 140px;
  box-sizing: border-box;
`;

export const Media = styled.div`
  width: 100%;
  height: 140px;
  position: relative;
  background: #f0f0f0;
  overflow: hidden;
`;

export const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const LoadingHolder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
`;

export const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #1a73e8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Bar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 32px;
  height: 4px;
  background: rgba(0, 0, 0, 0.08);
`;

export const Progress = styled.div`
  height: 100%;
  background: #1a73e8;
  transition: width 0.2s ease;
`;

export const ErrorBadge = styled.div`
  position: absolute;
  left: 8px;
  top: -22px;
  background: #d93025;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
`;

export const PrimaryBadge = styled.div`
  position: absolute;
  right: 8px;
  top: -22px;
  background: #1a73e8;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
`;

export const Actions = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 32px;
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 6px;
  justify-content: center;
  button {
    background: rgba(255, 255, 255, 0.95);
    border: 0;
    border-radius: 6px;
    padding: 4px 6px;
    cursor: pointer;
    font-size: 12px;
  }
`;
