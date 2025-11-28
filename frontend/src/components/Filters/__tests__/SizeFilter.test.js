import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import SizeFilter from "../SizeFilter";

describe("SizeFilter Component", () => {
  const sizes = ["S", "M", "L"];

  test("renders all size options", () => {
    render(<SizeFilter sizes={sizes} onChange={() => {}} />);
    sizes.forEach(size => {
      const sizeDiv = screen.getByText(size);
      expect(sizeDiv).toBeInTheDocument();
    });
  });

  test("calls onChange with applied sizes when clicked", () => {
    const onChange = jest.fn();
    render(<SizeFilter sizes={sizes} onChange={onChange} />);

    const sizeS = screen.getByText("S");
    fireEvent.click(sizeS);

    // onChange may be called twice because of useEffect
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining(["S"]));
  });

  test("can select multiple sizes", () => {
    const onChange = jest.fn();
    render(<SizeFilter sizes={sizes} onChange={onChange} />);

    fireEvent.click(screen.getByText("S"));
    fireEvent.click(screen.getByText("M"));

    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining(["S", "M"]));
  });

  test("unselecting a size removes it from applied sizes", () => {
    const onChange = jest.fn();
    render(<SizeFilter sizes={sizes} onChange={onChange} />);

    const sizeL = screen.getByText("L");
    fireEvent.click(sizeL); // select
    
    // Verify L is selected by checking the last call
    const selectCalls = onChange.mock.calls;
    expect(selectCalls[selectCalls.length - 1][0]).toContain("L");
    
    fireEvent.click(sizeL); // unselect

    // Verify L is no longer in the array
    const unselectCalls = onChange.mock.calls;
    expect(unselectCalls[unselectCalls.length - 1][0]).not.toContain("L");
    expect(unselectCalls[unselectCalls.length - 1][0]).toEqual([]);
  });

  test("applies correct styling to selected sizes", () => {
    render(<SizeFilter sizes={sizes} onChange={() => {}} />);

    const sizeS = screen.getByText("S");
    
    // Check initial styling (unselected)
    expect(sizeS).toHaveStyle({ background: '', color: '' });
    
    fireEvent.click(sizeS);
    
    // Check selected styling
    expect(sizeS).toHaveStyle({ background: 'black', color: 'white' });
  });

  test("single select mode only allows one size at a time", () => {
    const onChange = jest.fn();
    render(<SizeFilter sizes={sizes} multi={false} onChange={onChange} />);

    fireEvent.click(screen.getByText("S"));
    fireEvent.click(screen.getByText("M"));

    // The last call should only contain M, not both S and M
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall).toEqual(["M"]);
    expect(lastCall).toHaveLength(1);
  });

  test("multi select mode allows multiple sizes", () => {
    const onChange = jest.fn();
    render(<SizeFilter sizes={sizes} multi={true} onChange={onChange} />);

    fireEvent.click(screen.getByText("S"));
    fireEvent.click(screen.getByText("M"));
    fireEvent.click(screen.getByText("L"));

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall).toEqual(["S", "M", "L"]);
    expect(lastCall).toHaveLength(3);
  });

  test("initializes with empty array", () => {
    const onChange = jest.fn();
    render(<SizeFilter sizes={sizes} onChange={onChange} />);

    // The first call to onChange should be with an empty array
    expect(onChange).toHaveBeenCalledWith([]);
  });

  test("hides title when hidleTitle is true", () => {
    const { container } = render(<SizeFilter sizes={sizes} hidleTitle={true} onChange={() => {}} />);
    
    const titleElement = container.querySelector('p');
    expect(titleElement).not.toBeInTheDocument();
  });

  test("shows title when hidleTitle is false", () => {
    render(<SizeFilter sizes={sizes} hidleTitle={false} onChange={() => {}} />);
    
    const titleElement = screen.getByText("Size");
    expect(titleElement).toBeInTheDocument();
  });

  test("clicking same size twice deselects it", () => {
    const onChange = jest.fn();
    render(<SizeFilter sizes={sizes} onChange={onChange} />);

    const sizeM = screen.getByText("M");
    
    fireEvent.click(sizeM); // select
    fireEvent.click(sizeM); // deselect
    
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall).not.toContain("M");
  });

  test("in single mode, selecting already selected item deselects it", () => {
    const onChange = jest.fn();
    render(<SizeFilter sizes={sizes} multi={false} onChange={onChange} />);

    const sizeS = screen.getByText("S");
    
    fireEvent.click(sizeS); // select
    let lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall).toEqual(["S"]);
    
    fireEvent.click(sizeS); // deselect
    lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall).toEqual([]);
  });
});